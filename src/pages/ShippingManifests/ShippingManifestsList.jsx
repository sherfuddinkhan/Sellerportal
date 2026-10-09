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
    Typography,
    TextField,
    MenuItem,
    Button,
    IconButton,
    Tooltip,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Snackbar,
    Alert,
    Divider,
    TablePagination
} from "@mui/material";

import {
    Refresh,
    Search,
    Clear,
    Add,
    Close,
    Delete,
    Edit,
    Visibility
} from "@mui/icons-material";

import ShippingManifestToolbar from "./ShippingManifestToolbar";
import ShippingManifestStatistics from "./ShippingManifestStatistics";
import ShippingManifestTable from "./ShippingManifestTable";
import ShippingManifestView from "./ShippingManifestView";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_URL = "/api/ShippingManifest";

/* =========================================================
   SAFE FIELD ACCESS
========================================================= */

const getField = (record, ...keys) => {
    if (!record) return null;

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

    return null;
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

    const candidates = [
        responseData.data,
        responseData.Data,
        responseData.items,
        responseData.Items,
        responseData.records,
        responseData.Records,
        responseData.results,
        responseData.Results,
        responseData.$values
    ];

    for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
            return candidate;
        }
    }

    return [];
};

/* =========================================================
   ERROR MESSAGE
========================================================= */

const getErrorMessage = (error) => {
    const responseData = error?.response?.data;

    if (typeof responseData === "string") {
        return responseData;
    }

    if (responseData && typeof responseData === "object") {
        return (
            responseData.message ||
            responseData.Message ||
            responseData.title ||
            responseData.Title ||
            responseData.error ||
            responseData.Error ||
            error.message ||
            "An unexpected error occurred."
        );
    }

    if (error?.request && !error?.response) {
        return "Unable to connect to the server. Please check your connection and API configuration.";
    }

    return error?.message || "An unexpected error occurred.";
};

/* =========================================================
   GET MANIFEST ID
========================================================= */

const getManifestId = (manifest) =>
    getField(
        manifest,
        "shippingManifestId",
        "ShippingManifestId",
        "manifestId",
        "ManifestId",
        "id",
        "Id"
    );

/* =========================================================
   INITIAL FORM STATE
========================================================= */

const initialForm = {
    manifestNumber: "",
    orderNumber: "",
    customerName: "",
    carrierName: "",
    trackingNumber: "",
    vehicleNumber: "",
    driverName: "",
    driverContact: "",
    shipmentDate: "",
    expectedDeliveryDate: "",
    actualDeliveryDate: "",
    origin: "",
    destination: "",
    totalItems: "",
    totalQuantity: "",
    totalPackages: "",
    totalWeight: "",
    weightUnit: "",
    shippingCost: "",
    status: "Pending",
    notes: ""
};

/* =========================================================
   FORM FIELD CONFIGURATION
========================================================= */

const formFields = [
    {
        name: "manifestNumber",
        label: "Manifest Number",
        required: true
    },
    {
        name: "orderNumber",
        label: "Order Number"
    },
    {
        name: "customerName",
        label: "Customer / Consignee"
    },
    {
        name: "carrierName",
        label: "Carrier / Transporter"
    },
    {
        name: "trackingNumber",
        label: "Tracking Number"
    },
    {
        name: "vehicleNumber",
        label: "Vehicle Number"
    },
    {
        name: "driverName",
        label: "Driver Name"
    },
    {
        name: "driverContact",
        label: "Driver Contact"
    },
    {
        name: "shipmentDate",
        label: "Shipment Date",
        type: "date"
    },
    {
        name: "expectedDeliveryDate",
        label: "Expected Delivery Date",
        type: "date"
    },
    {
        name: "actualDeliveryDate",
        label: "Actual Delivery Date",
        type: "date"
    },
    {
        name: "origin",
        label: "Origin / Dispatch Location"
    },
    {
        name: "destination",
        label: "Destination / Delivery Location"
    },
    {
        name: "totalItems",
        label: "Total Items",
        type: "number"
    },
    {
        name: "totalQuantity",
        label: "Total Quantity",
        type: "number"
    },
    {
        name: "totalPackages",
        label: "Total Packages",
        type: "number"
    },
    {
        name: "totalWeight",
        label: "Total Weight",
        type: "number"
    },
    {
        name: "weightUnit",
        label: "Weight Unit"
    },
    {
        name: "shippingCost",
        label: "Shipping Cost",
        type: "number"
    }
];

/* =========================================================
   MAP API RECORD TO FORM
========================================================= */

const mapManifestToForm = (manifest) => {
    const form = {};

    Object.keys(initialForm).forEach((field) => {
        const pascalField =
            field.charAt(0).toUpperCase() + field.slice(1);

        let value = getField(manifest, field, pascalField);

        if (value === null) {
            value = initialForm[field];
        }

        if (
            [
                "shipmentDate",
                "expectedDeliveryDate",
                "actualDeliveryDate"
            ].includes(field) &&
            value
        ) {
            const date = new Date(value);

            value = Number.isNaN(date.getTime())
                ? ""
                : date.toISOString().slice(0, 10);
        }

        form[field] = value;
    });

    return form;
};

/* =========================================================
   CONVERT FORM TO PAYLOAD
========================================================= */

const buildPayload = (form) => {
    const payload = { ...form };

    [
        "totalItems",
        "totalQuantity",
        "totalPackages",
        "totalWeight",
        "shippingCost"
    ].forEach((field) => {
        if (payload[field] === "" || payload[field] === null) {
            payload[field] = null;
        } else {
            payload[field] = Number(payload[field]);
        }
    });

    [
        "shipmentDate",
        "expectedDeliveryDate",
        "actualDeliveryDate"
    ].forEach((field) => {
        if (!payload[field]) {
            payload[field] = null;
        }
    });

    return payload;
};

/* =========================================================
   SHIPPING MANIFESTS LIST
========================================================= */

const ShippingManifestsList = () => {
    /* =====================================================
       STATE
    ===================================================== */

    const [manifests, setManifests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [exporting, setExporting] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [showFilters, setShowFilters] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("create");
    const [selectedManifest, setSelectedManifest] = useState(null);
    const [form, setForm] = useState(initialForm);
    const [formError, setFormError] = useState("");

    const [viewOpen, setViewOpen] = useState(false);
    const [viewManifest, setViewManifest] = useState(null);

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteManifest, setDeleteManifest] = useState(null);
    const [deleteError, setDeleteError] = useState("");

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

    /* =====================================================
       FETCH ALL MANIFESTS
    ===================================================== */

    const fetchManifests = useCallback(async () => {
        setLoading(true);

        try {
            const response = await axios.get(API_URL);

            const records = extractRecords(response.data);

            setManifests(records);
        } catch (error) {
            console.error(
                "GET ALL SHIPPING MANIFESTS ERROR:",
                error.response?.data || error.message
            );

            notify(
                `Failed to load shipping manifests: ${getErrorMessage(error)}`,
                "error"
            );
        } finally {
            setLoading(false);
        }
    }, [notify]);

    useEffect(() => {
        fetchManifests();
    }, [fetchManifests]);

    /* =====================================================
       SEARCH AND FILTER
    ===================================================== */

    const filteredManifests = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        return manifests.filter((manifest) => {
            const status = String(
                getField(
                    manifest,
                    "status",
                    "Status",
                    "manifestStatus",
                    "ManifestStatus"
                ) || ""
            )
                .trim()
                .toLowerCase()
                .replace(/[_-]+/g, " ");

            const matchesStatus =
                statusFilter === "all" ||
                status === statusFilter.toLowerCase();

            if (!matchesStatus) {
                return false;
            }

            if (!term) {
                return true;
            }

            const searchableFields = {
                manifestNumber: [
                    "manifestNumber",
                    "ManifestNumber",
                    "shippingManifestNumber",
                    "ShippingManifestNumber"
                ],
                orderNumber: [
                    "orderNumber",
                    "OrderNumber",
                    "salesOrderNumber",
                    "SalesOrderNumber"
                ],
                customerName: [
                    "customerName",
                    "CustomerName",
                    "consigneeName",
                    "ConsigneeName"
                ],
                carrierName: [
                    "carrierName",
                    "CarrierName",
                    "shippingCarrier",
                    "ShippingCarrier",
                    "transportName",
                    "TransportName"
                ],
                trackingNumber: [
                    "trackingNumber",
                    "TrackingNumber",
                    "trackingId",
                    "TrackingId"
                ],
                status: [
                    "status",
                    "Status",
                    "manifestStatus",
                    "ManifestStatus"
                ]
            };

            const fieldsToSearch =
                searchField === "all"
                    ? Object.values(searchableFields).flat()
                    : searchableFields[searchField] || [];

            return fieldsToSearch.some((field) => {
                const value = manifest[field];

                return (
                    value !== undefined &&
                    value !== null &&
                    String(value).toLowerCase().includes(term)
                );
            });
        });
    }, [manifests, searchTerm, searchField, statusFilter]);

    /* =====================================================
       PAGINATION
    ===================================================== */

    const paginatedManifests = useMemo(() => {
        const start = page * rowsPerPage;

        return filteredManifests.slice(
            start,
            start + rowsPerPage
        );
    }, [filteredManifests, page, rowsPerPage]);

    useEffect(() => {
        const maxPage = Math.max(
            0,
            Math.ceil(filteredManifests.length / rowsPerPage) - 1
        );

        if (page > maxPage) {
            setPage(maxPage);
        }
    }, [filteredManifests.length, page, rowsPerPage]);

    /* =====================================================
       STATISTICS
    ===================================================== */

    const statistics = useMemo(() => {
        let pending = 0;
        let shipped = 0;
        let delivered = 0;
        let cancelled = 0;
        let totalQuantity = 0;

        manifests.forEach((manifest) => {
            const status = String(
                getField(
                    manifest,
                    "status",
                    "Status",
                    "manifestStatus",
                    "ManifestStatus"
                ) || ""
            )
                .trim()
                .toLowerCase()
                .replace(/[_-]+/g, " ");

            if (
                ["pending", "processing", "ready", "packed"].includes(status)
            ) {
                pending += 1;
            } else if (
                ["shipped", "in transit"].includes(status)
            ) {
                shipped += 1;
            } else if (
                ["delivered", "completed"].includes(status)
            ) {
                delivered += 1;
            } else if (
                ["cancelled", "canceled", "failed", "rejected"].includes(status)
            ) {
                cancelled += 1;
            }

            const quantity = Number(
                getField(
                    manifest,
                    "totalQuantity",
                    "TotalQuantity",
                    "quantity",
                    "Quantity"
                )
            );

            if (Number.isFinite(quantity)) {
                totalQuantity += quantity;
            }
        });

        return {
            totalManifests: manifests.length,
            pendingManifests: pending,
            shippedManifests: shipped,
            deliveredManifests: delivered,
            cancelledManifests: cancelled,
            totalQuantity
        };
    }, [manifests]);

    /* =====================================================
       OPEN CREATE DIALOG
    ===================================================== */

    const handleCreate = () => {
        setDialogMode("create");
        setSelectedManifest(null);
        setForm(initialForm);
        setFormError("");
        setDialogOpen(true);
    };

    /* =====================================================
       OPEN EDIT DIALOG
    ===================================================== */

    const handleEdit = (manifest) => {
        setSelectedManifest(manifest);
        setForm(mapManifestToForm(manifest));
        setFormError("");
        setDialogMode("edit");
        setDialogOpen(true);
    };

    /* =====================================================
       OPEN VIEW DIALOG
    ===================================================== */

    const handleView = (manifest) => {
        setViewManifest(manifest);
        setViewOpen(true);
    };

    /* =====================================================
       FORM CHANGE
    ===================================================== */

    const handleFormChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        setFormError("");
    };

    /* =====================================================
       CREATE / UPDATE MANIFEST
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();
        setFormError("");

        if (!form.manifestNumber.trim()) {
            setFormError("Manifest Number is required.");
            return;
        }

        if (
            form.totalQuantity !== "" &&
            Number(form.totalQuantity) < 0
        ) {
            setFormError("Total Quantity cannot be negative.");
            return;
        }

        if (
            form.shippingCost !== "" &&
            Number(form.shippingCost) < 0
        ) {
            setFormError("Shipping Cost cannot be negative.");
            return;
        }

        const payload = buildPayload(form);

        setSubmitting(true);

        try {
            if (dialogMode === "create") {
                await axios.post(API_URL, payload);

                notify("Shipping manifest created successfully.");
            } else {
                const id = getManifestId(selectedManifest);

                if (id === null) {
                    throw new Error(
                        "Cannot update this manifest because its ID is missing."
                    );
                }

                await axios.put(
                    `${API_URL}/${encodeURIComponent(id)}`,
                    payload
                );

                notify("Shipping manifest updated successfully.");
            }

            setDialogOpen(false);
            setSelectedManifest(null);
            setForm(initialForm);

            await fetchManifests();
        } catch (error) {
            console.error(
                `${dialogMode === "create" ? "CREATE" : "UPDATE"} SHIPPING MANIFEST ERROR:`,
                error.response?.data || error.message
            );

            setFormError(getErrorMessage(error));
        } finally {
            setSubmitting(false);
        }
    };

    /* =====================================================
       OPEN DELETE CONFIRMATION
    ===================================================== */

    const handleDeleteRequest = (manifest) => {
        setDeleteManifest(manifest);
        setDeleteError("");
        setDeleteOpen(true);
    };

    /* =====================================================
       DELETE MANIFEST
    ===================================================== */

    const handleDelete = async () => {
        const id = getManifestId(deleteManifest);

        if (id === null) {
            setDeleteError(
                "Cannot delete this manifest because its ID is missing."
            );
            return;
        }

        setSubmitting(true);
        setDeleteError("");

        try {
            await axios.delete(
                `${API_URL}/${encodeURIComponent(id)}`
            );

            setDeleteOpen(false);
            setDeleteManifest(null);

            notify("Shipping manifest deleted successfully.");

            await fetchManifests();
        } catch (error) {
            console.error(
                "DELETE SHIPPING MANIFEST ERROR:",
                error.response?.data || error.message
            );

            setDeleteError(getErrorMessage(error));
        } finally {
            setSubmitting(false);
        }
    };

    /* =====================================================
       CLEAR SEARCH AND FILTERS
    ===================================================== */

    const handleClearFilters = () => {
        setSearchTerm("");
        setSearchField("all");
        setStatusFilter("all");
        setPage(0);
    };

    /* =====================================================
       EXPORT CSV
    ===================================================== */

    const handleExport = async () => {
        if (filteredManifests.length === 0) {
            notify("There are no shipping manifests to export.", "warning");
            return;
        }

        setExporting(true);

        try {
            const columns = [
                {
                    label: "Manifest ID",
                    keys: [
                        "shippingManifestId",
                        "ShippingManifestId",
                        "manifestId",
                        "ManifestId",
                        "id",
                        "Id"
                    ]
                },
                {
                    label: "Manifest Number",
                    keys: [
                        "manifestNumber",
                        "ManifestNumber",
                        "shippingManifestNumber",
                        "ShippingManifestNumber"
                    ]
                },
                {
                    label: "Order Number",
                    keys: [
                        "orderNumber",
                        "OrderNumber",
                        "salesOrderNumber",
                        "SalesOrderNumber"
                    ]
                },
                {
                    label: "Customer",
                    keys: [
                        "customerName",
                        "CustomerName",
                        "consigneeName",
                        "ConsigneeName"
                    ]
                },
                {
                    label: "Carrier",
                    keys: [
                        "carrierName",
                        "CarrierName",
                        "shippingCarrier",
                        "ShippingCarrier"
                    ]
                },
                {
                    label: "Tracking Number",
                    keys: ["trackingNumber", "TrackingNumber"]
                },
                {
                    label: "Shipment Date",
                    keys: ["shipmentDate", "ShipmentDate"]
                },
                {
                    label: "Expected Delivery",
                    keys: [
                        "expectedDeliveryDate",
                        "ExpectedDeliveryDate"
                    ]
                },
                {
                    label: "Quantity",
                    keys: [
                        "totalQuantity",
                        "TotalQuantity",
                        "quantity",
                        "Quantity"
                    ]
                },
                {
                    label: "Status",
                    keys: [
                        "status",
                        "Status",
                        "manifestStatus",
                        "ManifestStatus"
                    ]
                }
            ];

            const escapeCsv = (value) => {
                const text = value === null || value === undefined
                    ? ""
                    : String(value);

                return `"${text.replace(/"/g, '""')}"`;
            };

            const csvRows = [
                columns.map((column) => escapeCsv(column.label)).join(","),
                ...filteredManifests.map((manifest) =>
                    columns
                        .map((column) =>
                            escapeCsv(getField(manifest, ...column.keys))
                        )
                        .join(",")
                )
            ];

            const csvContent = "\uFEFF" + csvRows.join("\r\n");
            const blob = new Blob([csvContent], {
                type: "text/csv;charset=utf-8;"
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "shipping-manifests.csv";

            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);

            notify("Shipping manifests exported successfully.");
        } catch (error) {
            console.error("EXPORT SHIPPING MANIFESTS ERROR:", error);

            notify("Failed to export shipping manifests.", "error");
        } finally {
            setExporting(false);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            {/* TOOLBAR */}

            <ShippingManifestToolbar
                totalRecords={manifests.length}
                totalManifests={manifests.length}
                pendingManifests={statistics.pendingManifests}
                shippedManifests={statistics.shippedManifests}
                deliveredManifests={statistics.deliveredManifests}
                cancelledManifests={statistics.cancelledManifests}
                loading={loading}
                exporting={exporting}
                showFilters={showFilters}
                onAdd={handleCreate}
                onRefresh={fetchManifests}
                onExport={handleExport}
                onToggleFilters={() =>
                    setShowFilters((previous) => !previous)
                }
            />

            {/* STATISTICS */}

            <ShippingManifestStatistics
                manifests={manifests}
                statistics={statistics}
                loading={loading}
            />

            {/* SEARCH AND FILTERS */}

            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2
                }}
            >
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1.5}
                    alignItems={{ xs: "stretch", md: "center" }}
                >
                    <TextField
                        select
                        size="small"
                        label="Search Field"
                        value={searchField}
                        onChange={(event) => {
                            setSearchField(event.target.value);
                            setPage(0);
                        }}
                        sx={{ minWidth: { xs: "100%", md: 180 } }}
                    >
                        <MenuItem value="all">All Fields</MenuItem>
                        <MenuItem value="manifestNumber">
                            Manifest Number
                        </MenuItem>
                        <MenuItem value="orderNumber">
                            Order Number
                        </MenuItem>
                        <MenuItem value="customerName">
                            Customer
                        </MenuItem>
                        <MenuItem value="carrierName">
                            Carrier
                        </MenuItem>
                        <MenuItem value="trackingNumber">
                            Tracking Number
                        </MenuItem>
                        <MenuItem value="status">Status</MenuItem>
                    </TextField>

                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Search shipping manifests..."
                        value={searchTerm}
                        onChange={(event) => {
                            setSearchTerm(event.target.value);
                            setPage(0);
                        }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <Search
                                        sx={{
                                            mr: 1,
                                            color: "text.secondary"
                                        }}
                                    />
                                ),
                                endAdornment: searchTerm ? (
                                    <Tooltip title="Clear search">
                                        <IconButton
                                            size="small"
                                            onClick={() => {
                                                setSearchTerm("");
                                                setPage(0);
                                            }}
                                        >
                                            <Clear fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                ) : null
                            }
                        }}
                    />

                    {showFilters && (
                        <TextField
                            select
                            size="small"
                            label="Status"
                            value={statusFilter}
                            onChange={(event) => {
                                setStatusFilter(event.target.value);
                                setPage(0);
                            }}
                            sx={{ minWidth: { xs: "100%", md: 170 } }}
                        >
                            <MenuItem value="all">All Statuses</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="processing">Processing</MenuItem>
                            <MenuItem value="ready">Ready</MenuItem>
                            <MenuItem value="packed">Packed</MenuItem>
                            <MenuItem value="shipped">Shipped</MenuItem>
                            <MenuItem value="in transit">In Transit</MenuItem>
                            <MenuItem value="delivered">Delivered</MenuItem>
                            <MenuItem value="cancelled">Cancelled</MenuItem>
                        </TextField>
                    )}

                    <Button
                        variant="outlined"
                        startIcon={<Clear />}
                        onClick={handleClearFilters}
                        disabled={
                            !searchTerm &&
                            searchField === "all" &&
                            statusFilter === "all"
                        }
                        sx={{ whiteSpace: "nowrap" }}
                    >
                        Clear
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreate}
                        disabled={loading}
                        sx={{ whiteSpace: "nowrap" }}
                    >
                        Create
                    </Button>
                </Stack>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 1.5
                    }}
                >
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Showing {filteredManifests.length} of {manifests.length} manifests
                    </Typography>

                    <Tooltip title="Refresh records">
                        <span>
                            <IconButton
                                size="small"
                                onClick={fetchManifests}
                                disabled={loading}
                            >
                                {loading ? (
                                    <CircularProgress size={18} />
                                ) : (
                                    <Refresh fontSize="small" />
                                )}
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>
            </Paper>

            {/* MANIFEST TABLE */}

            <ShippingManifestTable
                manifests={paginatedManifests}
                loading={loading}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDeleteRequest}
            />

            {/* PAGINATION */}

            <Paper
                elevation={0}
                sx={{
                    mt: 1,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2
                }}
            >
                <TablePagination
                    component="div"
                    count={filteredManifests.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(event) => {
                        setRowsPerPage(Number(event.target.value));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    disabled={loading}
                />
            </Paper>

            {/* CREATE / EDIT DIALOG */}

            <Dialog
                open={dialogOpen}
                onClose={() => {
                    if (!submitting) {
                        setDialogOpen(false);
                    }
                }}
                fullWidth
                maxWidth="md"
            >
                <Box component="form" onSubmit={handleSubmit}>
                    <DialogTitle
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1
                        }}
                    >
                        <Typography variant="h6" fontWeight={700}>
                            {dialogMode === "create"
                                ? "Create Shipping Manifest"
                                : "Edit Shipping Manifest"}
                        </Typography>

                        <IconButton
                            onClick={() => setDialogOpen(false)}
                            disabled={submitting}
                            aria-label="Close manifest form"
                        >
                            <Close />
                        </IconButton>
                    </DialogTitle>

                    <Divider />

                    <DialogContent>
                        {formError && (
                            <Alert
                                severity="error"
                                sx={{ mb: 2 }}
                                onClose={() => setFormError("")}
                            >
                                {formError}
                            </Alert>
                        )}

                        <Grid container spacing={2}>
                            {formFields.map((field) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    key={field.name}
                                >
                                    <TextField
                                        fullWidth
                                        size="small"
                                        name={field.name}
                                        label={field.label}
                                        type={field.type || "text"}
                                        value={form[field.name] ?? ""}
                                        onChange={handleFormChange}
                                        required={Boolean(field.required)}
                                        disabled={submitting}
                                        slotProps={{
                                            inputLabel: {
                                                shrink:
                                                    field.type === "date"
                                                        ? true
                                                        : undefined
                                            },
                                            htmlInput:
                                                field.type === "number"
                                                    ? { min: 0, step: "any" }
                                                    : undefined
                                        }}
                                    />
                                </Grid>
                            ))}

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    select
                                    size="small"
                                    name="status"
                                    label="Status"
                                    value={form.status}
                                    onChange={handleFormChange}
                                    disabled={submitting}
                                >
                                    {[
                                        "Pending",
                                        "Processing",
                                        "Ready",
                                        "Packed",
                                        "Shipped",
                                        "In Transit",
                                        "Delivered",
                                        "Cancelled"
                                    ].map((status) => (
                                        <MenuItem
                                            key={status}
                                            value={status}
                                        >
                                            {status}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    name="notes"
                                    label="Notes / Remarks"
                                    value={form.notes}
                                    onChange={handleFormChange}
                                    disabled={submitting}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <Divider />

                    <DialogActions sx={{ p: 2.5 }}>
                        <Button
                            onClick={() => setDialogOpen(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={submitting}
                            startIcon={
                                submitting ? (
                                    <CircularProgress size={18} />
                                ) : dialogMode === "create" ? (
                                    <Add />
                                ) : (
                                    <Edit />
                                )
                            }
                        >
                            {submitting
                                ? "Saving..."
                                : dialogMode === "create"
                                    ? "Create Manifest"
                                    : "Save Changes"}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* VIEW DIALOG */}

            <ShippingManifestView
                open={viewOpen}
                onClose={() => {
                    setViewOpen(false);
                    setViewManifest(null);
                }}
                manifest={viewManifest}
            />

            {/* DELETE CONFIRMATION */}

            <Dialog
                open={deleteOpen}
                onClose={() => {
                    if (!submitting) {
                        setDeleteOpen(false);
                        setDeleteError("");
                    }
                }}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Delete Shipping Manifest</DialogTitle>

                <DialogContent>
                    {deleteError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {deleteError}
                        </Alert>
                    )}

                    <Typography variant="body2">
                        Are you sure you want to delete shipping manifest{" "}
                        <strong>
                            {getField(
                                deleteManifest,
                                "manifestNumber",
                                "ManifestNumber",
                                "shippingManifestNumber",
                                "ShippingManifestNumber"
                            ) ||
                                (getManifestId(deleteManifest) !== null
                                    ? `#${getManifestId(deleteManifest)}`
                                    : "")}
                        </strong>
                        ? This action cannot be undone.
                    </Typography>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setDeleteOpen(false)}
                        disabled={submitting}
                    >
                        Cancel
                    </Button>

                    <Button
                        color="error"
                        variant="contained"
                        startIcon={
                            submitting ? (
                                <CircularProgress size={18} />
                            ) : (
                                <Delete />
                            )
                        }
                        onClick={handleDelete}
                        disabled={submitting}
                    >
                        {submitting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* NOTIFICATIONS */}

            <Snackbar
                open={notification.open}
                autoHideDuration={5000}
                onClose={(event, reason) => {
                    if (reason !== "clickaway") {
                        setNotification((previous) => ({
                            ...previous,
                            open: false
                        }));
                    }
                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity={notification.severity}
                    variant="filled"
                    onClose={() =>
                        setNotification((previous) => ({
                            ...previous,
                            open: false
                        }))
                    }
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ShippingManifestsList;

