import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Paper,
    Chip,
    Divider,
    IconButton,
    Tooltip
} from "@mui/material";

import {
    Close,
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

/* =========================================================
   GET FIELD VALUE
   Supports camelCase and PascalCase API responses
========================================================= */

const getField = (object, ...keys) => {
    if (!object) return "";

    for (const key of keys) {
        if (
            object[key] !== undefined &&
            object[key] !== null
        ) {
            return object[key];
        }
    }

    return "";
};

/* =========================================================
   FORMAT TEXT
========================================================= */

const formatText = (
    value,
    fallback = "Not provided"
) => {
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
    if (value === null || value === undefined) {
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

    if (String(value).trim() === "") {
        return "Not provided";
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
            >
                {label}
            </Typography>

            <Typography
                variant="body2"
                fontWeight={500}
                sx={{
                    mt: 0.4,
                    whiteSpace: multiline
                        ? "pre-wrap"
                        : "normal",
                    overflowWrap: "anywhere"
                }}
            >
                {value}
            </Typography>
        </Box>
    </Box>
);

/* =========================================================
   VENDOR ITEM CUSTOM FIELD VIEW
========================================================= */

const VendorItemCustomFieldView = ({
    open = false,
    onClose,
    vendorItemCustomField = null,
    selectedVendorItemCustomField = null,
    customField = null,
    onEdit
}) => {
    const field =
        vendorItemCustomField ||
        selectedVendorItemCustomField ||
        customField ||
        {};

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

    const vendorId = getField(
        field,
        "vendorId",
        "VendorId"
    );

    const vendorName = getField(
        field,
        "vendorName",
        "VendorName"
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

    const isRequired = Boolean(
        getField(
            field,
            "isRequired",
            "IsRequired",
            "required",
            "Required"
        )
    );

    const isActive = getField(
        field,
        "isActive",
        "IsActive"
    ) !== false;

    const displayOrder = getField(
        field,
        "displayOrder",
        "DisplayOrder",
        "sortOrder",
        "SortOrder"
    );

    const description = getField(
        field,
        "description",
        "Description"
    );

    const options = getField(
        field,
        "options",
        "Options",
        "fieldOptions",
        "FieldOptions"
    );

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
        "ModifiedAt"
    );

    /* =====================================================
       ACTIONS
    ===================================================== */

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    const handleEdit = () => {
        if (onEdit) {
            onEdit(field);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            aria-labelledby="vendor-item-custom-field-title"
        >
            {/* HEADER */}

            <DialogTitle
                id="vendor-item-custom-field-title"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    pr: 2
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        minWidth: 0
                    }}
                >
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
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

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Custom Field Details
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ overflowWrap: "anywhere" }}
                        >
                            {formatText(
                                fieldLabel || fieldName,
                                "Vendor Item Custom Field"
                            )}
                        </Typography>
                    </Box>
                </Box>

                <Tooltip title="Close">
                    <IconButton
                        onClick={handleClose}
                        aria-label="Close dialog"
                    >
                        <Close />
                    </IconButton>
                </Tooltip>
            </DialogTitle>

            <Divider />

            {/* CONTENT */}

            <DialogContent
                sx={{
                    bgcolor: "background.default",
                    p: { xs: 2, sm: 3 }
                }}
            >
                {/* STATUS */}

                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        mb: 3,
                        borderRadius: 2,
                        bgcolor: "background.paper"
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 1.5
                        }}
                    >
                        <Box>
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                {formatText(
                                    fieldLabel || fieldName,
                                    "Unnamed Custom Field"
                                )}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {formatText(
                                    fieldKey,
                                    "No field key"
                                )}
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                display: "flex",
                                gap: 1,
                                flexWrap: "wrap"
                            }}
                        >
                            <Chip
                                size="small"
                                icon={
                                    isActive
                                        ? <CheckCircle />
                                        : <Cancel />
                                }
                                label={
                                    isActive
                                        ? "Active"
                                        : "Inactive"
                                }
                                color={
                                    isActive
                                        ? "success"
                                        : "default"
                                }
                                variant="outlined"
                            />

                            <Chip
                                size="small"
                                label={
                                    isRequired
                                        ? "Required"
                                        : "Optional"
                                }
                                color={
                                    isRequired
                                        ? "warning"
                                        : "default"
                                }
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                </Paper>

                {/* FIELD DETAILS */}

                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 2 }}
                >
                    Field Information
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Tag fontSize="small" />}
                            label="Custom Field ID"
                            value={formatText(
                                fieldId,
                                "Not assigned"
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Label fontSize="small" />}
                            label="Field Name"
                            value={formatText(fieldName)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Label fontSize="small" />}
                            label="Display Label"
                            value={formatText(fieldLabel)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<DataObject fontSize="small" />}
                            label="Field Key"
                            value={formatText(fieldKey)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<DataObject fontSize="small" />}
                            label="Field Type"
                            value={formatText(fieldType)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Tag fontSize="small" />}
                            label="Display Order"
                            value={formatText(
                                displayOrder,
                                "Not specified"
                            )}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* VENDOR AND ITEM */}

                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 2 }}
                >
                    Vendor and Item
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Business fontSize="small" />}
                            label="Vendor Name"
                            value={formatText(vendorName)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Tag fontSize="small" />}
                            label="Vendor ID"
                            value={formatText(
                                vendorId,
                                "Not assigned"
                            )}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Inventory2 fontSize="small" />}
                            label="Item Name"
                            value={formatText(itemName)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={<Tag fontSize="small" />}
                            label="Item ID"
                            value={formatText(
                                itemId,
                                "Not assigned"
                            )}
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* FIELD VALUE */}

                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 2 }}
                >
                    Field Value and Configuration
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <DetailItem
                            icon={<DataObject fontSize="small" />}
                            label="Current Value"
                            value={formatFieldValue(fieldValue)}
                            multiline
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <DetailItem
                            icon={<DataObject fontSize="small" />}
                            label="Default Value"
                            value={formatFieldValue(defaultValue)}
                            multiline
                        />
                    </Grid>

                    {options !== "" && (
                        <Grid item xs={12}>
                            <DetailItem
                                icon={<DataObject fontSize="small" />}
                                label="Options"
                                value={formatFieldValue(options)}
                                multiline
                            />
                        </Grid>
                    )}

                    <Grid item xs={12}>
                        <DetailItem
                            icon={<Notes fontSize="small" />}
                            label="Description"
                            value={formatText(description)}
                            multiline
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* AUDIT DETAILS */}

                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{ mb: 2 }}
                >
                    Audit Information
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={
                                <CalendarToday fontSize="small" />
                            }
                            label="Created At"
                            value={formatDate(createdAt)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <DetailItem
                            icon={
                                <CalendarToday fontSize="small" />
                            }
                            label="Last Updated"
                            value={formatDate(updatedAt)}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <Divider />

            {/* ACTIONS */}

            <DialogActions
                sx={{
                    p: 2.5,
                    gap: 1
                }}
            >
                <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleClose}
                >
                    Close
                </Button>

                {onEdit && (
                    <Button
                        variant="contained"
                        onClick={handleEdit}
                    >
                        Edit Custom Field
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default VendorItemCustomFieldView;

