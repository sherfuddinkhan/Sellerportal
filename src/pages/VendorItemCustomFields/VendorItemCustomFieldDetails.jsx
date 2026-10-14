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
    CheckCircle,
    Cancel,
    InfoOutlined
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/vendor-item-custom-fields";

/* =========================================================
   GET FIELD VALUE
   Supports camelCase and PascalCase responses
========================================================= */

const getField = (object, camelCase, pascalCase) => {
    if (!object) return undefined;

    return object[camelCase] ?? object[pascalCase];
};

/* =========================================================
   FORMAT DATE
========================================================= */

const formatDate = (value) => {
    if (!value) return "N/A";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
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
   DISPLAY VALUE
========================================================= */

const displayValue = (value) => {
    if (value === null || value === undefined || value === "") {
        return "N/A";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (Array.isArray(value)) {
        return value.length ? value.join(", ") : "N/A";
    }

    if (typeof value === "object") {
        return JSON.stringify(value, null, 2);
    }

    return String(value);
};

/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({ label, value }) => (
    <Grid item xs={12} sm={6} md={4}>
        <Box sx={{ minWidth: 0 }}>
            <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={700}
                sx={{
                    display: "block",
                    mb: 0.75,
                    textTransform: "uppercase",
                    letterSpacing: 0.5
                }}
            >
                {label}
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    overflowWrap: "anywhere",
                    whiteSpace: "pre-wrap"
                }}
            >
                {displayValue(value)}
            </Typography>
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
        sx={{ mb: 2 }}
    >
        {children}
    </Typography>
);

/* =========================================================
   VENDOR ITEM CUSTOM FIELD DETAILS PAGE
========================================================= */

const VendorItemCustomFieldDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* =====================================================
       LOAD CUSTOM FIELD
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

                if (!cancelled) {
                    const data = response.data;

                    setRecord(
                        Array.isArray(data)
                            ? data[0] ?? null
                            : data
                    );
                }
            } catch (err) {
                if (!cancelled) {
                    console.error(
                        "Failed to load custom field:",
                        err.response?.data || err.message
                    );

                    setError(
                        err.response?.status === 404
                            ? "Custom field not found."
                            : err.response?.data?.message ||
                              err.response?.data?.title ||
                              "Failed to load custom field details. Check that the Node API proxy is running."
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
       RECORD VALUES
    ===================================================== */

    const fieldId =
        getField(
            record,
            "vendorItemCustomFieldId",
            "VendorItemCustomFieldId"
        ) ??
        getField(record, "id", "Id") ??
        id;

    const vendorItemMasterId = getField(
        record,
        "vendorItemMasterId",
        "VendorItemMasterId"
    );

    const vendorId =
        getField(record, "vendorId", "VendorId") ??
        getField(record, "supplierId", "SupplierId");

    const vendorName =
        getField(record, "vendorName", "VendorName") ??
        getField(record, "supplierName", "SupplierName");

    const itemId = getField(record, "itemId", "ItemId");
    const itemName = getField(record, "itemName", "ItemName");

    const sellerId = getField(record, "sellerId", "SellerId");
    const customerId = getField(record, "customerId", "CustomerId");

    const name =
        getField(record, "name", "Name") ??
        getField(record, "fieldName", "FieldName");

    const fieldLabel = getField(
        record,
        "fieldLabel",
        "FieldLabel"
    );

    const fieldKey = getField(
        record,
        "fieldKey",
        "FieldKey"
    );

    const fieldType = getField(
        record,
        "fieldType",
        "FieldType"
    );

    const value =
        getField(record, "value", "Value") ??
        getField(record, "fieldValue", "FieldValue");

    const defaultValue = getField(
        record,
        "defaultValue",
        "DefaultValue"
    );

    const options = getField(record, "options", "Options");
    const description = getField(
        record,
        "description",
        "Description"
    );

    const displayOrder = getField(
        record,
        "displayOrder",
        "DisplayOrder"
    );

    const isRequiredValue = getField(
        record,
        "isRequired",
        "IsRequired"
    );

    const isActiveValue = getField(
        record,
        "isActive",
        "IsActive"
    );

    const createdAt =
        getField(record, "createdAt", "CreatedAt") ??
        getField(record, "createdDate", "CreatedDate");

    const updatedAt =
        getField(record, "updatedAt", "UpdatedAt") ??
        getField(record, "updatedDate", "UpdatedDate");

    const isRequired = isRequiredValue === true;
    const isActive = isActiveValue !== false;

    /* =====================================================
       NAVIGATION
    ===================================================== */

    const handleBack = () => {
        navigate("/vendor-item-custom-fields");
    };

    const handleEdit = () => {
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
                    alignItems: "center",
                    justifyContent: "center"
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
       ERROR / NO RECORD
    ===================================================== */

    if (error || !record) {
        return (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Paper
                    variant="outlined"
                    sx={{ p: 3, borderRadius: 2 }}
                >
                    <Breadcrumbs sx={{ mb: 3 }}>
                        <Link
                            component="button"
                            underline="hover"
                            color="inherit"
                            onClick={handleBack}
                        >
                            Vendor Item Custom Fields
                        </Link>

                        <Typography color="text.primary">
                            Details
                        </Typography>
                    </Breadcrumbs>

                    <Alert severity={error ? "error" : "info"} sx={{ mb: 3 }}>
                        {error || "No custom field details were returned by the API."}
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

            {/* PAGE HEADER */}

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
                    alignItems={{ xs: "stretch", md: "center" }}
                    spacing={2}
                >
                    <Box>
                        <Typography variant="h4" fontWeight={700}>
                            Custom Field Details
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            View vendor item custom field information and configuration.
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            Custom Field ID: {displayValue(fieldId)}
                        </Typography>
                    </Box>

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
                {/* BASIC INFORMATION */}

                <Paper
                    variant="outlined"
                    sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}
                >
                    <SectionTitle>
                        Basic Information
                    </SectionTitle>

                    <Grid container spacing={3}>
                        <DetailItem
                            label="Custom Field ID"
                            value={fieldId}
                        />

                        <DetailItem
                            label="Field Name / Name"
                            value={name}
                        />

                        <DetailItem
                            label="Field Label"
                            value={fieldLabel}
                        />

                        <DetailItem
                            label="Field Key"
                            value={fieldKey}
                        />

                        <DetailItem
                            label="Field Type"
                            value={fieldType}
                        />

                        <DetailItem
                            label="Display Order"
                            value={displayOrder}
                        />
                    </Grid>
                </Paper>

                {/* VENDOR AND ITEM */}

                <Paper
                    variant="outlined"
                    sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}
                >
                    <SectionTitle>
                        Vendor and Item
                    </SectionTitle>

                    <Grid container spacing={3}>
                        <DetailItem
                            label="Vendor Name"
                            value={vendorName}
                        />

                        <DetailItem
                            label="Vendor ID / Supplier ID"
                            value={vendorId}
                        />

                        <DetailItem
                            label="Vendor Item Master ID"
                            value={vendorItemMasterId}
                        />

                        <DetailItem
                            label="Item Name"
                            value={itemName}
                        />

                        <DetailItem
                            label="Item ID"
                            value={itemId}
                        />

                        <DetailItem
                            label="Seller ID"
                            value={sellerId}
                        />

                        <DetailItem
                            label="Customer ID"
                            value={customerId}
                        />
                    </Grid>
                </Paper>

                {/* FIELD CONFIGURATION */}

                <Paper
                    variant="outlined"
                    sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}
                >
                    <SectionTitle>
                        Field Configuration
                    </SectionTitle>

                    <Grid container spacing={3}>
                        <DetailItem
                            label="Field Value"
                            value={value}
                        />

                        <DetailItem
                            label="Default Value"
                            value={defaultValue}
                        />

                        <DetailItem
                            label="Options"
                            value={options}
                        />

                        <DetailItem
                            label="Required Field"
                            value={isRequired}
                        />

                        <DetailItem
                            label="Active Status"
                            value={isActive}
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
                        <InfoOutlined color="primary" />

                        <Typography variant="h6" fontWeight={700}>
                            Description
                        </Typography>
                    </Stack>

                    <Typography
                        variant="body1"
                        color={
                            description
                                ? "text.primary"
                                : "text.secondary"
                        }
                        sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
                    >
                        {displayValue(description)}
                    </Typography>
                </Paper>

                {/* AUDIT INFORMATION */}

                <Paper
                    variant="outlined"
                    sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}
                >
                    <SectionTitle>
                        Audit Information
                    </SectionTitle>

                    <Grid container spacing={3}>
                        <DetailItem
                            label="Created Date"
                            value={formatDate(createdAt)}
                        />

                        <DetailItem
                            label="Updated Date"
                            value={formatDate(updatedAt)}
                        />
                    </Grid>
                </Paper>
            </Stack>
        </Box>
    );
};

export default VendorItemCustomFieldDetails;
