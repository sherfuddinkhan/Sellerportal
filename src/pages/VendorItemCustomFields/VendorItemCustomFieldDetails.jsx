import React from "react";

import {
    Alert,
    Box,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    Button,
    Paper,
    Stack,
    Typography
} from "@mui/material";

import {
    Edit,
    Close,
    CheckCircle,
    Cancel,
    InfoOutlined
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
   Supports camelCase and PascalCase API responses
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
        return JSON.stringify(value);
    }

    return String(value);
};

/* =========================================================
   DETAIL ITEM
========================================================= */

const DetailItem = ({ label, value }) => (
    <Grid item xs={12} sm={6}>
        <Box sx={{ minWidth: 0 }}>
            <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                sx={{
                    display: "block",
                    mb: 0.5,
                    textTransform: "uppercase",
                    letterSpacing: 0.4
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
        variant="subtitle1"
        fontWeight={700}
        sx={{ mb: 2 }}
    >
        {children}
    </Typography>
);

/* =========================================================
   VENDOR ITEM CUSTOM FIELD DETAILS
========================================================= */

const VendorItemCustomFieldDetails = ({
    open = true,
    onClose,
    onEdit,
    vendorItemCustomField = null,
    selectedVendorItemCustomField = null,
    customField = null,
    loading = false
}) => {
    const record =
        vendorItemCustomField ||
        selectedVendorItemCustomField ||
        customField;

    if (!record && !loading) {
        return (
            <Dialog
                open={open}
                onClose={onClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Custom Field Details</DialogTitle>

                <DialogContent>
                    <Alert severity="info">
                        No custom field has been selected.
                    </Alert>
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={onClose}
                        startIcon={<Close />}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    const id =
        getField(
            record,
            "vendorItemCustomFieldId",
            "VendorItemCustomFieldId"
        ) ??
        getField(record, "id", "Id");

    const vendorId = getField(record, "vendorId", "VendorId");
    const vendorName =
        getField(record, "vendorName", "VendorName") ??
        getField(record, "supplierName", "SupplierName");

    const itemId = getField(record, "itemId", "ItemId");
    const itemName = getField(record, "itemName", "ItemName");

    const fieldName = getField(record, "fieldName", "FieldName");
    const fieldLabel = getField(record, "fieldLabel", "FieldLabel");
    const fieldKey = getField(record, "fieldKey", "FieldKey");
    const fieldType = getField(record, "fieldType", "FieldType");
    const fieldValue = getField(record, "fieldValue", "FieldValue");
    const defaultValue = getField(record, "defaultValue", "DefaultValue");
    const options = getField(record, "options", "Options");
    const description = getField(record, "description", "Description");
    const displayOrder = getField(record, "displayOrder", "DisplayOrder");
    const isRequired = Boolean(
        getField(record, "isRequired", "IsRequired")
    );
    const isActive =
        getField(record, "isActive", "IsActive") !== false;

    const createdAt = getField(record, "createdAt", "CreatedAt");
    const updatedAt = getField(record, "updatedAt", "UpdatedAt");

    const handleEdit = () => {
        if (onEdit) {
            onEdit(record);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
        >
            {/* HEADER */}

            <DialogTitle sx={{ pb: 2 }}>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={1.5}
                >
                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            Custom Field Details
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            View vendor item custom field information.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} flexWrap="wrap">
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
            </DialogTitle>

            <Divider />

            {/* CONTENT */}

            <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
                {loading ? (
                    <Alert severity="info">
                        Loading custom field details...
                    </Alert>
                ) : (
                    <Stack spacing={3}>
                        {/* BASIC INFORMATION */}

                        <Paper
                            variant="outlined"
                            sx={{ p: 2, borderRadius: 2 }}
                        >
                            <SectionTitle>
                                Basic Information
                            </SectionTitle>

                            <Grid container spacing={2.5}>
                                <DetailItem
                                    label="Custom Field ID"
                                    value={id}
                                />

                                <DetailItem
                                    label="Field Name"
                                    value={fieldName}
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
                            sx={{ p: 2, borderRadius: 2 }}
                        >
                            <SectionTitle>
                                Vendor and Item
                            </SectionTitle>

                            <Grid container spacing={2.5}>
                                <DetailItem
                                    label="Vendor Name"
                                    value={vendorName}
                                />

                                <DetailItem
                                    label="Vendor ID"
                                    value={vendorId}
                                />

                                <DetailItem
                                    label="Item Name"
                                    value={itemName}
                                />

                                <DetailItem
                                    label="Item ID"
                                    value={itemId}
                                />
                            </Grid>
                        </Paper>

                        {/* FIELD VALUES */}

                        <Paper
                            variant="outlined"
                            sx={{ p: 2, borderRadius: 2 }}
                        >
                            <SectionTitle>
                                Field Configuration
                            </SectionTitle>

                            <Grid container spacing={2.5}>
                                <DetailItem
                                    label="Field Value"
                                    value={fieldValue}
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
                            sx={{ p: 2, borderRadius: 2 }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                sx={{ mb: 1.5 }}
                            >
                                <InfoOutlined color="primary" />

                                <SectionTitle>
                                    Description
                                </SectionTitle>
                            </Stack>

                            <Typography
                                variant="body2"
                                color={
                                    description
                                        ? "text.primary"
                                        : "text.secondary"
                                }
                                sx={{ whiteSpace: "pre-wrap" }}
                            >
                                {displayValue(description)}
                            </Typography>
                        </Paper>

                        {/* AUDIT INFORMATION */}

                        <Paper
                            variant="outlined"
                            sx={{ p: 2, borderRadius: 2 }}
                        >
                            <SectionTitle>
                                Audit Information
                            </SectionTitle>

                            <Grid container spacing={2.5}>
                                <DetailItem
                                    label="Created At"
                                    value={formatDate(createdAt)}
                                />

                                <DetailItem
                                    label="Updated At"
                                    value={formatDate(updatedAt)}
                                />
                            </Grid>
                        </Paper>
                    </Stack>
                )}
            </DialogContent>

            <Divider />

            {/* ACTIONS */}

            <DialogActions sx={{ p: 2 }}>
                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<Close />}
                    onClick={onClose}
                >
                    Close
                </Button>

                {onEdit && record && (
                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={handleEdit}
                        disabled={loading}
                    >
                        Edit Custom Field
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default VendorItemCustomFieldDetails;
