import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";

import {
    Save,
    Cancel,
    RestartAlt
} from "@mui/icons-material";

/* =========================================================
   DEFAULT FORM DATA
========================================================= */

const initialFormData = {
    vendorId: "",
    itemId: "",
    fieldName: "",
    fieldLabel: "",
    fieldKey: "",
    fieldType: "Text",
    fieldValue: "",
    defaultValue: "",
    options: "",
    description: "",
    displayOrder: 0,
    isRequired: false,
    isActive: true
};

/* =========================================================
   FIELD HELPER
   Supports camelCase and PascalCase API responses
========================================================= */

const getField = (object, camelCase, pascalCase) => {
    if (!object) return "";

    return object[camelCase] ??
        object[pascalCase] ??
        "";
};

/* =========================================================
   VENDOR ITEM CUSTOM FIELD FORM
========================================================= */

const VendorItemCustomFieldForm = ({
    open = true,
    vendorItemCustomField = null,
    selectedVendorItemCustomField = null,
    customField = null,
    mode = "create",
    isEdit = false,
    apiUrl = "http://localhost:5000/api/VendorItemCustomField",
    vendorsApiUrl = "http://localhost:5000/api/Supplier",
    itemsApiUrl = "http://localhost:5000/api/Item",
    vendors: providedVendors,
    items: providedItems,
    onSuccess,
    onCancel,
    onClose
}) => {
    const record =
        vendorItemCustomField ||
        selectedVendorItemCustomField ||
        customField;

    const editing =
        isEdit ||
        mode === "edit" ||
        Boolean(record);

    const [formData, setFormData] = useState(initialFormData);
    const [vendors, setVendors] = useState(providedVendors || []);
    const [items, setItems] = useState(providedItems || []);

    const [loading, setLoading] = useState(false);
    const [loadingVendors, setLoadingVendors] = useState(false);
    const [loadingItems, setLoadingItems] = useState(false);

    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    /* =====================================================
       LOAD VENDORS
    ===================================================== */

    const fetchVendors = async () => {
        if (providedVendors) {
            setVendors(providedVendors);
            return;
        }

        setLoadingVendors(true);

        try {
            const response = await axios.get(vendorsApiUrl);

            const data = response.data;

            const vendorList = Array.isArray(data)
                ? data
                : data?.data ||
                  data?.items ||
                  data?.$values ||
                  [];

            setVendors(Array.isArray(vendorList) ? vendorList : []);
        } catch (error) {
            console.error("GET VENDORS ERROR:", error);

            setNotification({
                open: true,
                message: "Unable to load vendors.",
                severity: "error"
            });
        } finally {
            setLoadingVendors(false);
        }
    };

    /* =====================================================
       LOAD ITEMS
    ===================================================== */

    const fetchItems = async () => {
        if (providedItems) {
            setItems(providedItems);
            return;
        }

        setLoadingItems(true);

        try {
            const response = await axios.get(itemsApiUrl);

            const data = response.data;

            const itemList = Array.isArray(data)
                ? data
                : data?.data ||
                  data?.items ||
                  data?.$values ||
                  [];

            setItems(Array.isArray(itemList) ? itemList : []);
        } catch (error) {
            console.error("GET ITEMS ERROR:", error);

            setNotification({
                open: true,
                message: "Unable to load items.",
                severity: "error"
            });
        } finally {
            setLoadingItems(false);
        }
    };

    /* =====================================================
       POPULATE FORM
    ===================================================== */

    const populateForm = (data) => {
        if (!data) {
            setFormData(initialFormData);
            return;
        }

        const fieldOptions = getField(data, "options", "Options");

        setFormData({
            vendorId: String(
                getField(data, "vendorId", "VendorId") ?? ""
            ),
            itemId: String(
                getField(data, "itemId", "ItemId") ?? ""
            ),
            fieldName: getField(data, "fieldName", "FieldName"),
            fieldLabel: getField(data, "fieldLabel", "FieldLabel"),
            fieldKey: getField(data, "fieldKey", "FieldKey"),
            fieldType:
                getField(data, "fieldType", "FieldType") || "Text",
            fieldValue:
                getField(data, "fieldValue", "FieldValue") ?? "",
            defaultValue:
                getField(data, "defaultValue", "DefaultValue") ?? "",
            options: Array.isArray(fieldOptions)
                ? fieldOptions.join(", ")
                : fieldOptions ?? "",
            description:
                getField(data, "description", "Description") ?? "",
            displayOrder: Number(
                getField(data, "displayOrder", "DisplayOrder") ?? 0
            ),
            isRequired: Boolean(
                getField(data, "isRequired", "IsRequired")
            ),
            isActive:
                getField(data, "isActive", "IsActive") !== false
        });
    };

    /* =====================================================
       INITIALIZE FORM
    ===================================================== */

    useEffect(() => {
        if (!open) return;

        fetchVendors();
        fetchItems();
        populateForm(record);
    }, [open, record, providedVendors, providedItems]);

    /* =====================================================
       HANDLE INPUT CHANGE
    ===================================================== */

    const handleChange = (event) => {
        const { name, value, checked, type } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: ""
        }));
    };

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {
        const validationErrors = {};

        if (!formData.vendorId) {
            validationErrors.vendorId = "Please select a vendor.";
        }

        if (!formData.itemId) {
            validationErrors.itemId = "Please select an item.";
        }

        if (!formData.fieldName.trim()) {
            validationErrors.fieldName = "Field name is required.";
        }

        if (!formData.fieldLabel.trim()) {
            validationErrors.fieldLabel = "Field label is required.";
        }

        if (!formData.fieldKey.trim()) {
            validationErrors.fieldKey = "Field key is required.";
        }

        if (!formData.fieldType) {
            validationErrors.fieldType = "Please select a field type.";
        }

        if (
            formData.displayOrder === "" ||
            !Number.isFinite(Number(formData.displayOrder)) ||
            Number(formData.displayOrder) < 0
        ) {
            validationErrors.displayOrder =
                "Display order must be a non-negative number.";
        }

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    };

    /* =====================================================
       SUBMIT FORM
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        const payload = {
            vendorId: Number(formData.vendorId),
            itemId: Number(formData.itemId),
            fieldName: formData.fieldName.trim(),
            fieldLabel: formData.fieldLabel.trim(),
            fieldKey: formData.fieldKey.trim(),
            fieldType: formData.fieldType,
            fieldValue: formData.fieldValue,
            defaultValue: formData.defaultValue,
            options: formData.options
                .split(",")
                .map((option) => option.trim())
                .filter(Boolean),
            description: formData.description.trim(),
            displayOrder: Number(formData.displayOrder),
            isRequired: formData.isRequired,
            isActive: formData.isActive
        };

        try {
            const id =
                getField(
                    record,
                    "vendorItemCustomFieldId",
                    "VendorItemCustomFieldId"
                ) ||
                getField(record, "id", "Id");

            if (editing && id) {
                await axios.put(`${apiUrl}/${id}`, {
                    ...payload,
                    vendorItemCustomFieldId: Number(id)
                });
            } else {
                await axios.post(apiUrl, payload);
            }

            setNotification({
                open: true,
                message: editing
                    ? "Custom field updated successfully."
                    : "Custom field created successfully.",
                severity: "success"
            });

            if (onSuccess) {
                await onSuccess();
            }

            if (onCancel) {
                onCancel();
            } else if (onClose) {
                onClose();
            }

            if (!editing) {
                setFormData(initialFormData);
                setErrors({});
            }
        } catch (error) {
            console.error(
                "SAVE VENDOR ITEM CUSTOM FIELD ERROR:",
                error
            );

            const apiMessage =
                error.response?.data?.message ||
                error.response?.data?.title ||
                error.response?.data?.detail;

            setNotification({
                open: true,
                message:
                    apiMessage ||
                    `Unable to ${
                        editing ? "update" : "create"
                    } custom field. Please check the API and submitted fields.`,
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       RESET FORM
    ===================================================== */

    const handleReset = () => {
        populateForm(record);
        setErrors({});
    };

    /* =====================================================
       CLOSE FORM
    ===================================================== */

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else if (onClose) {
            onClose();
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    if (!open) return null;

    return (
        <Paper
            elevation={3}
            sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 2,
                width: "100%"
            }}
        >
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" fontWeight={700}>
                    {editing
                        ? "Edit Vendor Item Custom Field"
                        : "Create Vendor Item Custom Field"}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                >
                    {editing
                        ? "Update the custom field details below."
                        : "Enter the details to create a custom field for a vendor item."}
                </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2.5}>
                    {/* VENDOR */}

                    <Grid item xs={12} md={6}>
                        <FormControl
                            fullWidth
                            required
                            error={Boolean(errors.vendorId)}
                            disabled={loadingVendors || loading}
                        >
                            <InputLabel id="vendor-label">
                                Vendor
                            </InputLabel>

                            <Select
                                labelId="vendor-label"
                                name="vendorId"
                                value={formData.vendorId}
                                label="Vendor"
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>Select vendor</em>
                                </MenuItem>

                                {vendors.map((vendor) => {
                                    const id = getField(
                                        vendor,
                                        "vendorId",
                                        "VendorId"
                                    ) || getField(vendor, "supplierId", "SupplierId")
                                      || getField(vendor, "id", "Id");

                                    const name = getField(
                                        vendor,
                                        "vendorName",
                                        "VendorName"
                                    ) || getField(vendor, "supplierName", "SupplierName")
                                      || getField(vendor, "name", "Name");

                                    if (id === "") return null;

                                    return (
                                        <MenuItem
                                            key={id}
                                            value={String(id)}
                                        >
                                            {name || `Vendor ${id}`}
                                        </MenuItem>
                                    );
                                })}
                            </Select>

                            {errors.vendorId && (
                                <Typography
                                    variant="caption"
                                    color="error"
                                >
                                    {errors.vendorId}
                                </Typography>
                            )}
                        </FormControl>
                    </Grid>

                    {/* ITEM */}

                    <Grid item xs={12} md={6}>
                        <FormControl
                            fullWidth
                            required
                            error={Boolean(errors.itemId)}
                            disabled={loadingItems || loading}
                        >
                            <InputLabel id="item-label">
                                Item
                            </InputLabel>

                            <Select
                                labelId="item-label"
                                name="itemId"
                                value={formData.itemId}
                                label="Item"
                                onChange={handleChange}
                            >
                                <MenuItem value="">
                                    <em>Select item</em>
                                </MenuItem>

                                {items.map((item) => {
                                    const id = getField(
                                        item,
                                        "itemId",
                                        "ItemId"
                                    ) || getField(item, "id", "Id");

                                    const name = getField(
                                        item,
                                        "itemName",
                                        "ItemName"
                                    ) || getField(item, "name", "Name");

                                    if (id === "") return null;

                                    return (
                                        <MenuItem
                                            key={id}
                                            value={String(id)}
                                        >
                                            {name || `Item ${id}`}
                                        </MenuItem>
                                    );
                                })}
                            </Select>

                            {errors.itemId && (
                                <Typography
                                    variant="caption"
                                    color="error"
                                >
                                    {errors.itemId}
                                </Typography>
                            )}
                        </FormControl>
                    </Grid>

                    {/* FIELD NAME */}

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            required
                            name="fieldName"
                            label="Field Name"
                            value={formData.fieldName}
                            onChange={handleChange}
                            error={Boolean(errors.fieldName)}
                            helperText={errors.fieldName}
                            disabled={loading}
                            placeholder="e.g. Material"
                        />
                    </Grid>

                    {/* FIELD LABEL */}

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            required
                            name="fieldLabel"
                            label="Field Label"
                            value={formData.fieldLabel}
                            onChange={handleChange}
                            error={Boolean(errors.fieldLabel)}
                            helperText={errors.fieldLabel}
                            disabled={loading}
                            placeholder="e.g. Material Type"
                        />
                    </Grid>

                    {/* FIELD KEY */}

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            required
                            name="fieldKey"
                            label="Field Key"
                            value={formData.fieldKey}
                            onChange={handleChange}
                            error={Boolean(errors.fieldKey)}
                            helperText={
                                errors.fieldKey ||
                                "Unique identifier used by the application."
                            }
                            disabled={loading}
                            placeholder="e.g. material_type"
                        />
                    </Grid>

                    {/* FIELD TYPE */}

                    <Grid item xs={12} md={6}>
                        <FormControl
                            fullWidth
                            required
                            error={Boolean(errors.fieldType)}
                            disabled={loading}
                        >
                            <InputLabel id="field-type-label">
                                Field Type
                            </InputLabel>

                            <Select
                                labelId="field-type-label"
                                name="fieldType"
                                value={formData.fieldType}
                                label="Field Type"
                                onChange={handleChange}
                            >
                                <MenuItem value="Text">Text</MenuItem>
                                <MenuItem value="Number">Number</MenuItem>
                                <MenuItem value="Decimal">Decimal</MenuItem>
                                <MenuItem value="Date">Date</MenuItem>
                                <MenuItem value="DateTime">Date & Time</MenuItem>
                                <MenuItem value="Boolean">Boolean</MenuItem>
                                <MenuItem value="Checkbox">Checkbox</MenuItem>
                                <MenuItem value="Dropdown">Dropdown</MenuItem>
                                <MenuItem value="Select">Select</MenuItem>
                                <MenuItem value="Textarea">Textarea</MenuItem>
                                <MenuItem value="Email">Email</MenuItem>
                                <MenuItem value="URL">URL</MenuItem>
                            </Select>

                            {errors.fieldType && (
                                <Typography
                                    variant="caption"
                                    color="error"
                                >
                                    {errors.fieldType}
                                </Typography>
                            )}
                        </FormControl>
                    </Grid>

                    {/* FIELD VALUE */}

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            name="fieldValue"
                            label="Field Value"
                            value={formData.fieldValue}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Grid>

                    {/* DEFAULT VALUE */}

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            name="defaultValue"
                            label="Default Value"
                            value={formData.defaultValue}
                            onChange={handleChange}
                            disabled={loading}
                        />
                    </Grid>

                    {/* OPTIONS */}

                    {["Dropdown", "Select"].includes(formData.fieldType) && (
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="options"
                                label="Options"
                                value={formData.options}
                                onChange={handleChange}
                                disabled={loading}
                                placeholder="Small, Medium, Large"
                                helperText="Enter options separated by commas."
                            />
                        </Grid>
                    )}

                    {/* DISPLAY ORDER */}

                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            required
                            type="number"
                            name="displayOrder"
                            label="Display Order"
                            value={formData.displayOrder}
                            onChange={handleChange}
                            error={Boolean(errors.displayOrder)}
                            helperText={errors.displayOrder}
                            disabled={loading}
                            inputProps={{ min: 0, step: 1 }}
                        />
                    </Grid>

                    {/* DESCRIPTION */}

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            name="description"
                            label="Description"
                            value={formData.description}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder="Enter field description"
                        />
                    </Grid>

                    {/* REQUIRED */}

                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="isRequired"
                                    checked={formData.isRequired}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            }
                            label="Required Field"
                        />
                    </Grid>

                    {/* ACTIVE */}

                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            }
                            label="Active"
                        />
                    </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* ACTIONS */}

                <Box
                    display="flex"
                    justifyContent="flex-end"
                    flexWrap="wrap"
                    gap={1.5}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="outlined"
                        startIcon={<RestartAlt />}
                        onClick={handleReset}
                        disabled={loading}
                    >
                        Reset
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={
                            loading
                                ? <CircularProgress size={18} color="inherit" />
                                : <Save />
                        }
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : editing
                                ? "Update Custom Field"
                                : "Create Custom Field"}
                    </Button>
                </Box>
            </Box>

            {/* NOTIFICATION */}

            <Snackbar
                open={notification.open}
                autoHideDuration={5000}
                onClose={() =>
                    setNotification((previous) => ({
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
                    severity={notification.severity}
                    variant="filled"
                    onClose={() =>
                        setNotification((previous) => ({
                            ...previous,
                            open: false
                        }))
                    }
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
};

export default VendorItemCustomFieldForm;
