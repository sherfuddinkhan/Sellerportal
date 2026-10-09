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
    Typography,
    CircularProgress,
    Snackbar,
    Alert,
    Paper
} from "@mui/material";

import VendorItemCustomFieldToolbar from "./VendorItemCustomFieldToolbar";
import VendorItemCustomFieldStatistics from "./VendorItemCustomFieldStatistics";
import VendorItemCustomFieldTable from "./VendorItemCustomFieldTable";
import VendorItemCustomFieldSearch from "./VendorItemCustomFieldSearch";
import VendorItemCustomFieldView from "./VendorItemCustomFieldView";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = "http://localhost:5000/api";

const API_URL = `${API_BASE_URL}/VendorItemCustomField`;

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (object, ...keys) => {
    for (const key of keys) {
        if (
            object?.[key] !== undefined &&
            object?.[key] !== null
        ) {
            return object[key];
        }
    }

    return null;
};

/* =========================================================
   NORMALIZE API RESPONSE
========================================================= */

const normalizeListResponse = (responseData) => {
    if (Array.isArray(responseData)) {
        return responseData;
    }

    if (!responseData || typeof responseData !== "object") {
        return [];
    }

    const possibleLists = [
        responseData.data,
        responseData.items,
        responseData.results,
        responseData.records,
        responseData.vendorItemCustomFields,
        responseData.VendorItemCustomFields,
        responseData.customFields,
        responseData.CustomFields
    ];

    for (const value of possibleLists) {
        if (Array.isArray(value)) {
            return value;
        }
    }

    return [];
};

/* =========================================================
   ERROR MESSAGE
========================================================= */

const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (data && typeof data === "object") {
        return (
            data.message ||
            data.Message ||
            data.title ||
            data.detail ||
            error.message ||
            "An unexpected error occurred."
        );
    }

    return error?.message || "An unexpected error occurred.";
};

/* =========================================================
   VENDOR ITEM CUSTOM FIELDS LIST
========================================================= */

const VendorItemCustomFieldsList = ({
    apiUrl = API_URL,
    title = "Vendor Item Custom Fields",
    subtitle = "Manage custom fields assigned to vendor items",
    refreshInterval = 0,
    onAdd,
    onEdit,
    onDelete,
    onView,
    onManageFields,
    initialPageSize = 10
}) => {
    /* =====================================================
       STATE
    ===================================================== */

    const [vendorItemCustomFields, setVendorItemCustomFields] =
        useState([]);

    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [requiredFilter, setRequiredFilter] = useState("all");

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(initialPageSize);

    const [selectedField, setSelectedField] = useState(null);
    const [viewOpen, setViewOpen] = useState(false);

    const [alert, setAlert] = useState({
        open: false,
        message: "",
        severity: "info"
    });

    /* =====================================================
       SHOW ALERT
    ===================================================== */

    const showAlert = useCallback((message, severity = "info") => {
        setAlert({
            open: true,
            message,
            severity
        });
    }, []);

    /* =====================================================
       GET RECORD ID
    ===================================================== */

    const getRecordId = useCallback((field) => {
        return getFieldValue(
            field,
            "vendorItemCustomFieldId",
            "VendorItemCustomFieldId",
            "id",
            "Id"
        );
    }, []);

    /* =====================================================
       GET ALL CUSTOM FIELDS
    ===================================================== */

    const fetchVendorItemCustomFields = useCallback(
        async (showLoader = true) => {
            if (showLoader) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            try {
                const response = await axios.get(apiUrl);

                const records = normalizeListResponse(
                    response.data
                );

                setVendorItemCustomFields(records);

                return records;
            } catch (error) {
                console.error(
                    "GET VENDOR ITEM CUSTOM FIELDS ERROR:",
                    error
                );

                showAlert(
                    `Failed to load custom fields: ${getErrorMessage(error)}`,
                    "error"
                );

                return null;
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [apiUrl, showAlert]
    );

    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        fetchVendorItemCustomFields();
    }, [fetchVendorItemCustomFields]);

    /* =====================================================
       OPTIONAL AUTO REFRESH
    ===================================================== */

    useEffect(() => {
        if (!refreshInterval || refreshInterval <= 0) {
            return undefined;
        }

        const intervalId = setInterval(() => {
            fetchVendorItemCustomFields(false);
        }, refreshInterval);

        return () => clearInterval(intervalId);
    }, [
        refreshInterval,
        fetchVendorItemCustomFields
    ]);

    /* =====================================================
       SEARCH AND FILTER
    ===================================================== */

    const filteredFields = useMemo(() => {
        const normalizedSearch = searchTerm
            .trim()
            .toLowerCase();

        return vendorItemCustomFields.filter((field) => {
            const fieldName = String(
                getFieldValue(field, "fieldName", "FieldName") ?? ""
            ).toLowerCase();

            const fieldLabel = String(
                getFieldValue(field, "fieldLabel", "FieldLabel") ?? ""
            ).toLowerCase();

            const fieldKey = String(
                getFieldValue(field, "fieldKey", "FieldKey") ?? ""
            ).toLowerCase();

            const fieldType = String(
                getFieldValue(field, "fieldType", "FieldType") ?? ""
            ).toLowerCase();

            const vendorName = String(
                getFieldValue(field, "vendorName", "VendorName") ?? ""
            ).toLowerCase();

            const itemName = String(
                getFieldValue(
                    field,
                    "itemName",
                    "ItemName",
                    "productName",
                    "ProductName"
                ) ?? ""
            ).toLowerCase();

            const matchesSearch =
                !normalizedSearch ||
                [
                    fieldName,
                    fieldLabel,
                    fieldKey,
                    fieldType,
                    vendorName,
                    itemName
                ].some((value) =>
                    value.includes(normalizedSearch)
                );

            const isActiveValue = getFieldValue(
                field,
                "isActive",
                "IsActive"
            );

            const isActive =
                isActiveValue === true ||
                isActiveValue === 1 ||
                String(isActiveValue).toLowerCase() === "true";

            const isRequiredValue = getFieldValue(
                field,
                "isRequired",
                "IsRequired"
            );

            const isRequired =
                isRequiredValue === true ||
                isRequiredValue === 1 ||
                String(isRequiredValue).toLowerCase() === "true";

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && isActive) ||
                (statusFilter === "inactive" && !isActive);

            const matchesRequired =
                requiredFilter === "all" ||
                (requiredFilter === "required" && isRequired) ||
                (requiredFilter === "optional" && !isRequired);

            return (
                matchesSearch &&
                matchesStatus &&
                matchesRequired
            );
        });
    }, [
        vendorItemCustomFields,
        searchTerm,
        statusFilter,
        requiredFilter
    ]);

    /* =====================================================
       PAGINATION
    ===================================================== */

    const totalPages = Math.max(
        1,
        Math.ceil(filteredFields.length / pageSize)
    );

    const paginatedFields = useMemo(() => {
        const startIndex = page * pageSize;

        return filteredFields.slice(
            startIndex,
            startIndex + pageSize
        );
    }, [filteredFields, page, pageSize]);

    useEffect(() => {
        setPage((currentPage) =>
            Math.min(currentPage, totalPages - 1)
        );
    }, [totalPages]);

    /* =====================================================
       FILTER COUNTS
    ===================================================== */

    const activeFields = useMemo(() => {
        return vendorItemCustomFields.filter((field) => {
            const value = getFieldValue(
                field,
                "isActive",
                "IsActive"
            );

            return (
                value === true ||
                value === 1 ||
                String(value).toLowerCase() === "true"
            );
        }).length;
    }, [vendorItemCustomFields]);

    const inactiveFields = Math.max(
        vendorItemCustomFields.length - activeFields,
        0
    );

    /* =====================================================
       REFRESH
    ===================================================== */

    const handleRefresh = async () => {
        await fetchVendorItemCustomFields(false);
    };

    /* =====================================================
       RESET FILTERS
    ===================================================== */

    const handleClearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setRequiredFilter("all");
        setPage(0);
    };

    /* =====================================================
       OPEN VIEW DIALOG
    ===================================================== */

    const handleView = (field) => {
        setSelectedField(field);
        setViewOpen(true);

        if (onView) {
            onView(field);
        }
    };

    /* =====================================================
       CLOSE VIEW DIALOG
    ===================================================== */

    const handleCloseView = () => {
        setViewOpen(false);
        setSelectedField(null);
    };

    /* =====================================================
       EDIT CUSTOM FIELD
    ===================================================== */

    const handleEdit = (field) => {
        if (onEdit) {
            onEdit(field);
            return;
        }

        showAlert(
            "Connect the edit form using the onEdit prop.",
            "info"
        );
    };

    /* =====================================================
       ADD CUSTOM FIELD
    ===================================================== */

    const handleAdd = () => {
        if (onAdd) {
            onAdd();
            return;
        }

        showAlert(
            "Connect the create form using the onAdd prop.",
            "info"
        );
    };

    /* =====================================================
       DELETE CUSTOM FIELD
    ===================================================== */

    const handleDelete = async (field) => {
        const id = getRecordId(field);

        if (id === null || id === undefined) {
            showAlert(
                "Cannot delete this field because its ID is missing.",
                "error"
            );
            return;
        }

        const fieldName = getFieldValue(
            field,
            "fieldName",
            "FieldName"
        ) || "this custom field";

        const confirmed = window.confirm(
            `Are you sure you want to delete "${fieldName}"?`
        );

        if (!confirmed) {
            return;
        }

        setDeletingId(id);

        try {
            await axios.delete(`${apiUrl}/${id}`);

            setVendorItemCustomFields((previous) =>
                previous.filter(
                    (item) => String(getRecordId(item)) !== String(id)
                )
            );

            showAlert(
                "Custom field deleted successfully.",
                "success"
            );

            if (onDelete) {
                onDelete(field);
            }
        } catch (error) {
            console.error(
                "DELETE VENDOR ITEM CUSTOM FIELD ERROR:",
                error
            );

            showAlert(
                `Failed to delete custom field: ${getErrorMessage(error)}`,
                "error"
            );
        } finally {
            setDeletingId(null);
        }
    };

    /* =====================================================
       TOGGLE ACTIVE STATUS
       Requires API support for PUT/PATCH.
    ===================================================== */

    const handleToggleStatus = async (field) => {
        const id = getRecordId(field);

        if (id === null || id === undefined) {
            showAlert(
                "Cannot update status because the field ID is missing.",
                "error"
            );
            return;
        }

        const currentStatus = getFieldValue(
            field,
            "isActive",
            "IsActive"
        );

        const currentlyActive =
            currentStatus === true ||
            currentStatus === 1 ||
            String(currentStatus).toLowerCase() === "true";

        const nextStatus = !currentlyActive;

        const originalField = field;

        setVendorItemCustomFields((previous) =>
            previous.map((item) =>
                String(getRecordId(item)) === String(id)
                    ? {
                        ...item,
                        isActive: nextStatus,
                        IsActive: nextStatus
                    }
                    : item
            )
        );

        try {
            /*
             * Adjust this request to match your backend endpoint.
             * This assumes PUT accepts the complete field object.
             */
            await axios.put(`${apiUrl}/${id}`, {
                ...originalField,
                isActive: nextStatus,
                IsActive: nextStatus
            });

            showAlert(
                `Custom field ${nextStatus ? "activated" : "deactivated"} successfully.`,
                "success"
            );
        } catch (error) {
            console.error(
                "UPDATE CUSTOM FIELD STATUS ERROR:",
                error
            );

            setVendorItemCustomFields((previous) =>
                previous.map((item) =>
                    String(getRecordId(item)) === String(id)
                        ? originalField
                        : item
                )
            );

            showAlert(
                `Failed to update status: ${getErrorMessage(error)}`,
                "error"
            );
        }
    };

    /* =====================================================
       EXPORT CSV
    ===================================================== */

    const handleExport = () => {
        if (filteredFields.length === 0) {
            showAlert(
                "There are no custom fields to export.",
                "warning"
            );
            return;
        }

        const headers = [
            "ID",
            "Field Name",
            "Field Label",
            "Field Key",
            "Field Type",
            "Vendor",
            "Item",
            "Field Value",
            "Required",
            "Active",
            "Display Order",
            "Description"
        ];

        const escapeCsv = (value) => {
            const text = String(value ?? "");
            return `"${text.replace(/"/g, '""')}"`;
        };

        const csvRows = filteredFields.map((field) => [
            getRecordId(field),
            getFieldValue(field, "fieldName", "FieldName"),
            getFieldValue(field, "fieldLabel", "FieldLabel"),
            getFieldValue(field, "fieldKey", "FieldKey"),
            getFieldValue(field, "fieldType", "FieldType"),
            getFieldValue(field, "vendorName", "VendorName") ??
                getFieldValue(field, "vendorId", "VendorId"),
            getFieldValue(field, "itemName", "ItemName") ??
                getFieldValue(field, "itemId", "ItemId"),
            getFieldValue(field, "fieldValue", "FieldValue"),
            getFieldValue(field, "isRequired", "IsRequired"),
            getFieldValue(field, "isActive", "IsActive"),
            getFieldValue(field, "displayOrder", "DisplayOrder"),
            getFieldValue(field, "description", "Description")
        ]);

        const csvContent = [
            headers.map(escapeCsv).join(","),
            ...csvRows.map((row) => row.map(escapeCsv).join(","))
        ].join("\r\n");

        const blob = new Blob(
            ["\uFEFF", csvContent],
            { type: "text/csv;charset=utf-8;" }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "vendor-item-custom-fields.csv";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        showAlert(
            "Custom fields exported successfully.",
            "success"
        );
    };

    /* =====================================================
       SEARCH HANDLER
    ===================================================== */

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setPage(0);
    };

    /* =====================================================
       STATUS FILTER HANDLER
    ===================================================== */

    const handleStatusFilterChange = (value) => {
        setStatusFilter(value);
        setPage(0);
    };

    /* =====================================================
       REQUIRED FILTER HANDLER
    ===================================================== */

    const handleRequiredFilterChange = (value) => {
        setRequiredFilter(value);
        setPage(0);
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ width: "100%", p: { xs: 1, sm: 2, md: 3 } }}>
            {/* =============================================
                PAGE HEADER
            ============================================= */}

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                flexDirection={{ xs: "column", sm: "row" }}
                gap={1}
                sx={{ mb: 3 }}
            >
                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                        gutterBottom
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {subtitle}
                    </Typography>
                </Box>
            </Box>

            {/* =============================================
                TOOLBAR
            ============================================= */}

            <Box sx={{ mb: 3 }}>
                <VendorItemCustomFieldToolbar
                    title={title}
                    subtitle={subtitle}
                    totalFields={vendorItemCustomFields.length}
                    activeFields={activeFields}
                    inactiveFields={inactiveFields}
                    loading={loading || refreshing}
                    onAdd={handleAdd}
                    onRefresh={handleRefresh}
                    onExport={handleExport}
                    onFilter={handleClearFilters}
                    onManageFields={onManageFields}
                    showStatistics={false}
                    showExport
                    showFilter
                    showManageFields={Boolean(onManageFields)}
                />
            </Box>

            {/* =============================================
                STATISTICS
            ============================================= */}

            <Box sx={{ mb: 3 }}>
                <VendorItemCustomFieldStatistics
                    vendorItemCustomFields={vendorItemCustomFields}
                    loading={loading}
                />
            </Box>

            {/* =============================================
                SEARCH
            ============================================= */}

            <Paper
                elevation={0}
                sx={{
                    p: 2,
                    mb: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2
                }}
            >
                <VendorItemCustomFieldSearch
                    searchTerm={searchTerm}
                    onSearchChange={handleSearchChange}
                    searchValue={searchTerm}
                    onSearch={handleSearchChange}
                    statusFilter={statusFilter}
                    onStatusFilterChange={handleStatusFilterChange}
                    requiredFilter={requiredFilter}
                    onRequiredFilterChange={handleRequiredFilterChange}
                    onClear={handleClearFilters}
                />
            </Paper>

            {/* =============================================
                TABLE HEADER
            ============================================= */}

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={1}
                sx={{ mb: 2 }}
            >
                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    Custom Fields
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Showing{" "}
                    {filteredFields.length === 0
                        ? 0
                        : page * pageSize + 1}
                    {" - "}
                    {Math.min(
                        (page + 1) * pageSize,
                        filteredFields.length
                    )}
                    {" of "}
                    {filteredFields.length} records
                </Typography>
            </Box>

            {/* =============================================
                TABLE
            ============================================= */}

            {loading ? (
                <Paper
                    elevation={0}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        py: 8,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2
                    }}
                >
                    <CircularProgress size={35} />

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 2 }}
                    >
                        Loading vendor item custom fields...
                    </Typography>
                </Paper>
            ) : (
                <VendorItemCustomFieldTable
                    vendorItemCustomFields={paginatedFields}
                    loading={false}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                />
            )}

            {/* =============================================
                PAGINATION
            ============================================= */}

            <Paper
                elevation={0}
                sx={{
                    mt: 2,
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2
                }}
            >
                <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Grid item xs={12} sm={4}>
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Rows per page:
                            </Typography>

                            <select
                                value={pageSize}
                                onChange={(event) => {
                                    setPageSize(
                                        Number(event.target.value)
                                    );
                                    setPage(0);
                                }}
                                style={{
                                    padding: "6px 10px",
                                    borderRadius: 6,
                                    border: "1px solid #ccc",
                                    background: "transparent",
                                    fontSize: 14
                                }}
                            >
                                {[5, 10, 25, 50, 100].map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={8}>
                        <Box
                            display="flex"
                            justifyContent={{ xs: "flex-start", sm: "flex-end" }}
                            alignItems="center"
                            gap={1}
                            flexWrap="wrap"
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mr: 1 }}
                            >
                                Page {page + 1} of {totalPages}
                            </Typography>

                            <button
                                type="button"
                                disabled={page === 0}
                                onClick={() => setPage(0)}
                            >
                                First
                            </button>

                            <button
                                type="button"
                                disabled={page === 0}
                                onClick={() =>
                                    setPage((current) =>
                                        Math.max(current - 1, 0)
                                    )
                                }
                            >
                                Previous
                            </button>

                            <button
                                type="button"
                                disabled={page >= totalPages - 1}
                                onClick={() =>
                                    setPage((current) =>
                                        Math.min(
                                            current + 1,
                                            totalPages - 1
                                        )
                                    )
                                }
                            >
                                Next
                            </button>

                            <button
                                type="button"
                                disabled={page >= totalPages - 1}
                                onClick={() =>
                                    setPage(totalPages - 1)
                                }
                            >
                                Last
                            </button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* =============================================
                VIEW DIALOG
            ============================================= */}

            <VendorItemCustomFieldView
                open={viewOpen}
                onClose={handleCloseView}
                vendorItemCustomField={selectedField}
                selectedVendorItemCustomField={selectedField}
                customField={selectedField}
                onEdit={(field) => {
                    handleCloseView();
                    handleEdit(field);
                }}
            />

            {/* =============================================
                ALERT
            ============================================= */}

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
                    severity={alert.severity}
                    variant="filled"
                    onClose={() =>
                        setAlert((previous) => ({
                            ...previous,
                            open: false
                        }))
                    }
                    sx={{ width: "100%" }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default VendorItemCustomFieldsList;

