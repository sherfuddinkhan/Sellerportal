import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Breadcrumbs,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Link,
    Paper,
    Stack,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Visibility,
    Inventory2,
    Business,
    Label,
    DataObject,
    CheckCircle,
    Cancel,
    CalendarToday,
    Notes,
    Tag
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/vendor-item-custom-fields";

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getField = (object, ...keys) => {
    if (!object) return undefined;

    for (const key of keys) {
        if (
            object[key] !== undefined &&
            object[key] !== null
        ) {
            return object[key];
        }
    }

    return undefined;
};

/* =========================================================
   FORMAT TEXT
========================================================= */

const formatText = (value, fallback = "Not provided") => {
    if (
        value === undefined ||
        value === null ||
        String(value).trim() === ""
    ) {
        return fallback;
    }

    return String(value);
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
};

/* =========================================================
   FORMAT FIELD VALUE
========================================================= */

const formatFieldValue = (value) => {
    if (value === undefined || value === null || value === "") {
        return "Not provided";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (typeof value === "object") {
        try {
            return JSON.stringify(value, null, 2);
        } catch {
            return String(value);
        }
    }

    return String(value);
};

/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({
    icon,
    label,
    value,
    multiline = false
}) => (
    <Grid xs={12} sm={6} md={4}>
        <Box
            sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                minWidth: 0
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                    mt: 0.25
                }}
            >
                {icon}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    fontWeight={700}
                    sx={{
                        textTransform: "uppercase",
                        letterSpacing: 0.4
                    }}
                >
                    {label}
                </Typography>

                <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{
                        mt: 0.5,
                        whiteSpace: multiline ? "pre-wrap" : "normal",
                        overflowWrap: "anywhere"
                    }}
                >
                    {value}
                </Typography>
            </Box>
        </Box>
    </Grid>
);

/* =========================================================
   SECTION TITLE
========================================================= */

const SectionTitle = ({ children }) => (
    <Typography
        variant="h6"
        fontWeight={700}
        sx={{ mb: 2.5 }}
    >
        {children}
    </Typography>
);

/* =========================================================
   VENDOR ITEM CUSTOM FIELD VIEW PAGE
========================================================= */

const VendorItemCustomFieldView = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [field, setField] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* =====================================================
       FETCH RECORD
    ===================================================== */

    useEffect(() => {
        let cancelled = false;

        const fetchCustomField = async () => {
            if (!id) {
                setError("Custom field ID is missing.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `${API_URL}/${encodeURIComponent(id)}`
                );

                const responseData = response.data?.data ?? response.data;

                const record = Array.isArray(responseData)
                    ? responseData[0]
                    : responseData;

                if (!record || typeof record !== "object") {
                    throw new Error(
                        "No custom field record was returned by the API."
                    );
                }

                if (!cancelled) {
                    setField(record);
                }
            } catch (err) {
                console.error(
                    "GET CUSTOM FIELD DETAILS ERROR:",
                    err.response?.data || err.message
                );

                if (!cancelled) {
                    setError(
                        err.response?.status === 404
                            ? "Custom field not found."
                            : err.response?.data?.message ||
                              err.response?.data?.title ||
                              err.response?.data?.detail ||
                              "Unable to load custom field details."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchCustomField();

        return () => {
            cancelled = true;
        };
    }, [id]);

    /* =====================================================
       NAVIGATION
    ===================================================== */

    const handleBack = () => {
        navigate("/vendor-item-custom-fields");
    };

    const handleEdit = () => {
        const fieldId =
            getField(
                field,
                "vendorItemCustomFieldId",
                "VendorItemCustomFieldId",
                "id",
                "Id"
            ) ?? id;

        navigate(`/vendor-item-custom-fields/${fieldId}/edit`);
    };

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "50vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Stack spacing={2} alignItems="center">
                    <CircularProgress />

                    <Typography color="text.secondary">
                        Loading custom field details...
                    </Typography>
                </Stack>
            </Box>
        );
    }

    /* =====================================================
       ERROR
    ===================================================== */

    if (error || !field) {
        return (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Paper
                    variant="outlined"
                    sx={{ p: 3, borderRadius: 2 }}
                >
                    <Alert
                        severity={error ? "error" : "info"}
                        sx={{ mb: 3 }}
                    >
                        {error || "Custom field record is unavailable."}
                    </Alert>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back to Custom Fields
                    </Button>
                </Paper>
            </Box>
        );
    }

    /* =====================================================
       FIELD INFORMATION
    ===================================================== */

    const fieldId = getField(
        field,
        "vendorItemCustomFieldId",
        "VendorItemCustomFieldId",
        "customFieldId",
        "CustomFieldId",
        "id",
        "Id"
    );

    const vendorItemMasterId = getField(
        field,
        "vendorItemMasterId",
        "VendorItemMasterId"
    );

    const vendorId = getField(
        field,
        "vendorId",
        "VendorId",
        "supplierId",
        "SupplierId"
    );

    const vendorName = getField(
        field,
        "vendorName",
        "VendorName",
        "supplierName",
        "SupplierName"
    );

    const itemId = getField(
        field,
        "itemId",
        "ItemId",
        "vendorItemId",
        "VendorItemId"
    );

    const itemName = getField(
        field,
        "itemName",
        "ItemName",
        "vendorItemName",
        "VendorItemName"
    );

    const sellerId = getField(field, "sellerId", "SellerId");
    const customerId = getField(field, "customerId", "CustomerId");

    const fieldName = getField(
        field,
        "fieldName",
        "FieldName",
        "customFieldName",
        "CustomFieldName",
        "name",
        "Name"
    );

    const fieldLabel = getField(
        field,
        "fieldLabel",
        "FieldLabel",
        "displayName",
        "DisplayName",
        "label",
        "Label"
    );

    const fieldKey = getField(
        field,
        "fieldKey",
        "FieldKey",
        "key",
        "Key"
    );

    const fieldType = getField(
        field,
        "fieldType",
        "FieldType",
        "dataType",
        "DataType",
        "type",
        "Type"
    );

    const fieldValue = getField(
        field,
        "fieldValue",
        "FieldValue",
        "customFieldValue",
        "CustomFieldValue",
        "value",
        "Value"
    );

    const defaultValue = getField(
        field,
        "defaultValue",
        "DefaultValue"
    );

    const options = getField(
        field,
        "options",
        "Options",
        "fieldOptions",
        "FieldOptions"
    );

    const description = getField(
        field,
        "description",
        "Description"
    );

    const displayOrder = getField(
        field,
        "displayOrder",
        "DisplayOrder",
        "sortOrder",
        "SortOrder"
    );

    const requiredValue = getField(
        field,
        "isRequired",
        "IsRequired",
        "required",
        "Required"
    );

    const activeValue = getField(
        field,
        "isActive",
        "IsActive"
    );

    const isRequired = requiredValue === true;
    const isActive = activeValue !== false;

    const createdAt = getField(
        field,
        "createdAt",
        "CreatedAt",
        "createdDate",
        "CreatedDate"
    );

    const updatedAt = getField(
        field,
        "updatedAt",
        "UpdatedAt",
        "modifiedAt",
        "ModifiedAt",
        "updatedDate",
        "UpdatedDate"
    );

    /* =====================================================
       DETAILS PAGE
    ===================================================== */

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            {/* BREADCRUMBS */}

            <Breadcrumbs sx={{ mb: 2 }}>
                <Link
                    component="button"
                    underline="hover"
                    color="inherit"
                    onClick={handleBack}
                >
                    Vendor Item Custom Fields
                </Link>

                <Typography color="text.primary">
                    Custom Field Details
                </Typography>
            </Breadcrumbs>

            {/* HEADER */}

            <Paper
                variant="outlined"
                sx={{
                    p: { xs: 2, md: 3 },
                    mb: 3,
                    borderRadius: 2
                }}
            >
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", md: "center" }}
                    spacing={2}
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                    >
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                bgcolor: "primary.light",
                                color: "primary.dark",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0
                            }}
                        >
                            <Visibility />
                        </Box>

                        <Box>
                            <Typography variant="h4" fontWeight={700}>
                                Custom Field Details
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.5 }}
                            >
                                {formatText(
                                    fieldLabel || fieldName,
                                    "Vendor Item Custom Field"
                                )}
                            </Typography>

                            <Typography
                                variant="caption"
                                color="text.secondary"
                            >
                                Record ID: {formatText(fieldId ?? id)}
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        useFlexGap
                    >
                        <Chip
                            icon={
                                isActive
                                    ? <CheckCircle />
                                    : <Cancel />
                            }
                            label={isActive ? "Active" : "Inactive"}
                            color={isActive ? "success" : "default"}
                            variant="outlined"
                        />

                        <Chip
                            label={isRequired ? "Required" : "Optional"}
                            color={isRequired ? "warning" : "default"}
                            variant="outlined"
                        />
                    </Stack>
                </Stack>

                <Divider sx={{ my: 2.5 }} />

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back to List
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                    >
                        Edit Custom Field
                    </Button>
                </Stack>
            </Paper>

            <Stack spacing={3}>
                {/* FIELD INFORMATION */}

                <Paper
                    variant="outlined"
                    sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}
                >
                    <SectionTitle>Field Information</SectionTitle>

                    <Grid container spacing={3}>
                        <DetailItem
                            icon={<Tag fontSize="small" />}
                            label="Custom Field ID"
                            value={formatText(fieldId ?? id)}
                        />

                        <DetailItem
                            icon={<Label fontSize="small" />}
                            label="Field Name / Name"
                            value={formatText(fieldName)}
                        />

                        <DetailItem
                            icon={<Label fontSize="small" />}
                            label="Display Label"
                            value={formatText(fieldLabel)}
                        />

                        <DetailItem
                            icon={<DataObject fontSize="small" />}
                            label="Field Key"
                            value={formatText(fieldKey)}
                        />

                        <DetailItem
                            icon={<DataObject fontSize="small" />}
                            label="Field Type"
                            value={formatText(fieldType)}
                        />

                        <DetailItem
                            icon={<Tag fontSize="small" />}
                            label="Display Order"
                            value={formatText(displayOrder)}
                        />
                    </Grid>
                </Paper>

                {/* VENDOR AND ITEM */}

                <Paper
                    variant="outlined"
                    sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}
                >
                    <SectionTitle>Vendor and Item</SectionTitle>

                    <Grid container spacing={3}>
                        <DetailItem
                            icon={<Business fontSize="small" />}
                            label="Vendor Name"
                            value={formatText(vendorName)}
                        />

                        <DetailItem
                            icon={<Tag fontSize="small" />}
                            label="Vendor ID / Supplier ID"
                            value={formatText(vendorId)}
                        />

                        <DetailItem
                            icon={<Inventory2 fontSize="small" />}
                            label="Vendor Item Master ID"
                            value={formatText(vendorItemMasterId)}
                        />

                        <DetailItem
                            icon={<Inventory2 fontSize="small" />}
                            label="Item Name"
                            value={formatText(itemName)}
                        />

                        <DetailItem
                            icon={<Tag fontSize="small" />}
                            label="Item ID"
                            value={formatText(itemId)}
                        />

                        <DetailItem
                            icon={<Business fontSize="small" />}
                            label="Seller ID"
                            value={formatText(sellerId)}
                        />

                        <DetailItem
                            icon={<Business fontSize="small" />}
                            label="Customer ID"
                            value={formatText(customerId)}
                        />
                    </Grid>
                </Paper>

                {/* FIELD VALUE AND CONFIGURATION */}

                <Paper
                    variant="outlined"
                    sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}
                >
                    <SectionTitle>
                        Field Value and Configuration
                    </SectionTitle>

                    <Grid container spacing={3}>
                        <DetailItem
                            icon={<DataObject fontSize="small" />}
                            label="Current Value"
                            value={formatFieldValue(fieldValue)}
                            multiline
                        />

                        <DetailItem
                            icon={<DataObject fontSize="small" />}
                            label="Default Value"
                            value={formatFieldValue(defaultValue)}
                            multiline
                        />

                        <DetailItem
                            icon={<DataObject fontSize="small" />}
                            label="Options"
                            value={formatFieldValue(options)}
                            multiline
                        />

                        <DetailItem
                            icon={<CheckCircle fontSize="small" />}
                            label="Required Field"
                            value={isRequired ? "Yes" : "No"}
                        />

                        <DetailItem
                            icon={
                                isActive
                                    ? <CheckCircle fontSize="small" />
                                    : <Cancel fontSize="small" />
                            }
                            label="Active Status"
                            value={isActive ? "Active" : "Inactive"}
                        />
                    </Grid>
                </Paper>

                {/* DESCRIPTION */}

                <Paper
                    variant="outlined"
                    sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mb: 2 }}
                    >
                        <Notes color="primary" />

                        <Typography variant="h6" fontWeight={700}>
                            Description
                        </Typography>
                    </Stack>

                    <Typography
                        variant="body2"
                        color={
                            description
                                ? "text.primary"
                                : "text.secondary"
                        }
                        sx={{
                            whiteSpace: "pre-wrap",
                            overflowWrap: "anywhere"
                        }}
                    >
                        {formatText(description)}
                    </Typography>
                </Paper>

                {/* AUDIT INFORMATION */}

                <Paper
                    variant="outlined"
                    sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}
                >
                    <SectionTitle>Audit Information</SectionTitle>

                    <Grid container spacing={3}>
                        <DetailItem
                            icon={<CalendarToday fontSize="small" />}
                            label="Created At"
                            value={formatDate(createdAt)}
                        />

                        <DetailItem
                            icon={<CalendarToday fontSize="small" />}
                            label="Last Updated"
                            value={formatDate(updatedAt)}
                        />
                    </Grid>
                </Paper>
            </Stack>
        </Box>
    );
};

export default VendorItemCustomFieldView;
