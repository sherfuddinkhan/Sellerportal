import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    Alert,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField
} from "@mui/material";

import {
    Save,
    Cancel
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
   GET FIELD VALUE
   Supports camelCase and PascalCase
========================================================= */

const getField = (object, camelCase, pascalCase) => {
    if (!object) return "";

    return object[camelCase] ??
        object[pascalCase] ??
        "";
};

/* =========================================================
   NORMALIZE API LIST RESPONSE
========================================================= */

const normalizeList = (data) => {
    if (Array.isArray(data)) return data;

    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.$values)) return data.$values;

    return [];
};

/* =========================================================
   VENDOR ITEM CUSTOM FIELD EDIT
========================================================= */

const VendorItemCustomFieldEdit = ({
    open = true,
    onClose,
    onSuccess,
    vendorItemCustomField = null,
    selectedVendorItemCustomField = null,
    customField = null,
    vendorItemCustomFieldId,
    apiUrl = "http://localhost:5000/api/VendorItemCustomField",
    vendorsApiUrl = "http://localhost:5000/api/Supplier",
    itemsApiUrl = "http://localhost:5000/api/Item",
    vendors: providedVendors,
    items: providedItems
}) => {
    const selectedRecord =
        vendorItemCustomField ||
        selectedVendorItemCustomField ||
        customField;

    const recordId =
        vendorItemCustomFieldId ??
        getField(
            selectedRecord,
            "vendorItemCustomFieldId",
            "VendorItemCustomFieldId"
        ) ??
        getField(selectedRecord, "id", "Id");

    const [formData, setFormData] = useState(initialFormData);

    const [vendors, setVendors] = useState(providedVendors || []);
    const [items, setItems] = useState(providedItems || []);

    const [loadingRecord, setLoadingRecord] = useState(false);
    const [loadingVendors, setLoadingVendors] = useState(false);
    const [loadingItems, setLoadingItems] = useState(false);
    const [saving, setSaving] = useState(false);

    const [errors, setErrors] = useState({});

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    /* =====================================================
       POPULATE FORM
    ===================================================== */

    const populateForm = (record) => {
        if (!record) {
            setFormData(initialFormData);
            return;
        }

        const options = getField(record, "options", "Options");

        setFormData({
            vendorId: String(
                getField(record, "vendorId", "VendorId") ?? ""
            ),
            itemId: String(
                getField(record, "itemId", "ItemId") ?? ""
            ),
            fieldName: getField(record, "fieldName", "FieldName") ?? "",
            fieldLabel: getField(record, "fieldLabel", "FieldLabel") ?? "",
            fieldKey: getField(record, "fieldKey", "FieldKey") ?? "",
            fieldType:
                getField(record, "fieldType", "FieldType") || "Text",
            fieldValue:
                getField(record, "fieldValue", "FieldValue") ?? "",
            defaultValue:
                getField(record, "defaultValue", "DefaultValue") ?? "",
            options: Array.isArray(options)
                ? options.join(", ")
                : options ?? "",
            description:
                getField(record, "description", "Description") ?? "",
            displayOrder: Number(
                getField(record, "displayOrder", "DisplayOrder") ?? 0
            ),
            isRequired: Boolean(
                getField(record, "isRequired", "IsRequired")
            ),
            isActive:
                getField(record, "isActive", "IsActive") !== false
        });
    };

    /* =====================================================
       FETCH RECORD BY ID
    ===================================================== */

    const fetchRecord = async () => {
        if (selectedRecord) {
            populateForm(selectedRecord);
            return;
        }

        if (recordId === undefined || recordId === null || recordId === "") {
            setNotification({
                open: true,
                message: "A custom field record or valid ID is required.",
                severity: "error"
            });
            return;
        }

        setLoadingRecord(true);

        try {
            const response = await axios.get(`${apiUrl}/${recordId}`);

            const data = response.data?.data ?? response.data;

            populateForm(data);
        } catch (error) {
            console.error(
                "GET VENDOR ITEM CUSTOM FIELD ERROR:",
                error
            );

            setNotification({
                open: true,
                message:
                    error.response?.data?.message ||
                    "Unable to load the custom field details.",
                severity: "error"
            });
        } finally {
            setLoadingRecord(false);
        }
    };

    /* =====================================================
       FETCH VENDORS
    ===================================================== */

    const fetchVendors = async () => {
        if (providedVendors) {
            setVendors(providedVendors);
            return;
        }

        setLoadingVendors(true);

        try {
            const response = await axios.get(vendorsApiUrl);
            setVendors(normalizeList(response.data));
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
       FETCH ITEMS
    ===================================================== */

    const fetchItems = async () => {
        if (providedItems) {
            setItems(providedItems);
            return;
        }

        setLoadingItems(true);

        try {
            const response = await axios.get(itemsApiUrl);
            setItems(normalizeList(response.data));
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
       INITIALIZE EDIT FORM
    ===================================================== */

    useEffect(() => {
        if (!open) return;

        fetchRecord();
        fetchVendors();
        fetchItems();
    }, [
        open,
        recordId,
        selectedRecord,
        providedVendors,
        providedItems,
        apiUrl
    ]);

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
            validationErrors.vendorId = "Vendor is required.";
        }

        if (!formData.itemId) {
            validationErrors.itemId = "Item is required.";
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
            validationErrors.fieldType = "Field type is required.";
        }

        if (
            formData.displayOrder === "" ||
            !Number.isFinite(Number(formData.displayOrder)) ||
            Number(formData.displayOrder) < 0
        ) {
            validationErrors.displayOrder =
                "Display order must be zero or greater.";
        }

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    };

    /* =====================================================
       UPDATE CUSTOM FIELD
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        if (recordId === undefined || recordId === null || recordId === "") {
            setNotification({
                open: true,
                message: "Cannot update without a valid custom field ID.",
                severity: "error"
            });
            return;
        }

        setSaving(true);

        const payload = {
            vendorItemCustomFieldId: Number(recordId),
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
            await axios.put(`${apiUrl}/${recordId}`, payload);

            setNotification({
                open: true,
                message: "Custom field updated successfully.",
                severity: "success"
            });

            if (onSuccess) {
                await onSuccess();
            }

            if (onClose) {
                onClose();
            }
        } catch (error) {
            console.error(
                "UPDATE VENDOR ITEM CUSTOM FIELD ERROR:",
                error
            );

            setNotification({
                open: true,
                message:
                    error.response?.data?.message ||
                    error.response?.data?.title ||
                    error.response?.data?.detail ||
                    "Unable to update the custom field.",
                severity: "error"
            });
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <>
            <Dialog
                open={open}
                onClose={saving ? undefined : onClose}
                fullWidth
                maxWidth="md"
                scroll="paper"
            >
                <DialogTitle fontWeight={700}>
                    Edit Vendor Item Custom Field
                </DialogTitle>

                <Divider />

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <DialogContent>
                        {loadingRecord ? (
                            <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                minHeight={250}
                            >
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Grid container spacing={2.5}>
                                {/* VENDOR */}

                                <Grid item xs={12} sm={6}>
                                    <FormControl
                                        fullWidth
                                        required
                                        error={Boolean(errors.vendorId)}
                                        disabled={loadingVendors || saving}
                                    >
                                        <InputLabel id="edit-vendor-label">
                                            Vendor
                                        </InputLabel>

                                        <Select
                                            labelId="edit-vendor-label"
                                            name="vendorId"
                                            value={formData.vendorId}
                                            label="Vendor"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="">
                                                Select Vendor
                                            </MenuItem>

                                            {vendors.map((vendor) => {
                                                const id =
                                                    getField(vendor, "vendorId", "VendorId") ||
                                                    getField(vendor, "supplierId", "SupplierId") ||
                                                    getField(vendor, "id", "Id");

                                                const name =
                                                    getField(vendor, "vendorName", "VendorName") ||
                                                    getField(vendor, "supplierName", "SupplierName") ||
                                                    getField(vendor, "name", "Name");

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
                                            <Alert severity="error">
                                                {errors.vendorId}
                                            </Alert>
                                        )}
                                    </FormControl>
                                </Grid>

                                {/* ITEM */}

                                <Grid item xs={12} sm={6}>
                                    <FormControl
                                        fullWidth
                                        required
                                        error={Boolean(errors.itemId)}
                                        disabled={loadingItems || saving}
                                    >
                                        <InputLabel id="edit-item-label">
                                            Item
                                        </InputLabel>

                                        <Select
                                            labelId="edit-item-label"
                                            name="itemId"
                                            value={formData.itemId}
                                            label="Item"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="">
                                                Select Item
                                            </MenuItem>

                                            {items.map((item) => {
                                                const id =
                                                    getField(item, "itemId", "ItemId") ||
                                                    getField(item, "id", "Id");

                                                const name =
                                                    getField(item, "itemName", "ItemName") ||
                                                    getField(item, "name", "Name");

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
                                            <Alert severity="error">
                                                {errors.itemId}
                                            </Alert>
                                        )}
                                    </FormControl>
                                </Grid>

                                {/* FIELD NAME */}

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        name="fieldName"
                                        label="Field Name"
                                        value={formData.fieldName}
                                        onChange={handleChange}
                                        error={Boolean(errors.fieldName)}
                                        helperText={errors.fieldName}
                                        disabled={saving}
                                    />
                                </Grid>

                                {/* FIELD LABEL */}

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        name="fieldLabel"
                                        label="Field Label"
                                        value={formData.fieldLabel}
                                        onChange={handleChange}
                                        error={Boolean(errors.fieldLabel)}
                                        helperText={errors.fieldLabel}
                                        disabled={saving}
                                    />
                                </Grid>

                                {/* FIELD KEY */}

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        required
                                        name="fieldKey"
                                        label="Field Key"
                                        value={formData.fieldKey}
                                        onChange={handleChange}
                                        error={Boolean(errors.fieldKey)}
                                        helperText={errors.fieldKey}
                                        disabled={saving}
                                    />
                                </Grid>

                                {/* FIELD TYPE */}

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth disabled={saving}>
                                        <InputLabel id="edit-field-type-label">
                                            Field Type
                                        </InputLabel>

                                        <Select
                                            labelId="edit-field-type-label"
                                            name="fieldType"
                                            value={formData.fieldType}
                                            label="Field Type"
                                            onChange={handleChange}
                                        >
                                            {[
                                                "Text",
                                                "Number",
                                                "Decimal",
                                                "Date",
                                                "DateTime",
                                                "Boolean",
                                                "Checkbox",
                                                "Dropdown",
                                                "Select",
                                                "Textarea",
                                                "Email",
                                                "URL"
                                            ].map((type) => (
                                                <MenuItem
                                                    key={type}
                                                    value={type}
                                                >
                                                    {type}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* FIELD VALUE */}

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="fieldValue"
                                        label="Field Value"
                                        value={formData.fieldValue}
                                        onChange={handleChange}
                                        disabled={saving}
                                    />
                                </Grid>

                                {/* DEFAULT VALUE */}

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="defaultValue"
                                        label="Default Value"
                                        value={formData.defaultValue}
                                        onChange={handleChange}
                                        disabled={saving}
                                    />
                                </Grid>

                                {/* OPTIONS */}

                                {["Dropdown", "Select"].includes(
                                    formData.fieldType
                                ) && (
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            name="options"
                                            label="Options"
                                            value={formData.options}
                                            onChange={handleChange}
                                            helperText="Separate options with commas."
                                            disabled={saving}
                                        />
                                    </Grid>
                                )}

                                {/* DISPLAY ORDER */}

                                <Grid item xs={12} sm={6}>
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
                                        inputProps={{ min: 0, step: 1 }}
                                        disabled={saving}
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
                                        disabled={saving}
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
                                                disabled={saving}
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
                                                disabled={saving}
                                            />
                                        }
                                        label="Active"
                                    />
                                </Grid>
                            </Grid>
                        )}
                    </DialogContent>

                    <Divider />

                    <DialogActions sx={{ p: 2 }}>
                        <Button
                            onClick={onClose}
                            color="inherit"
                            startIcon={<Cancel />}
                            disabled={saving}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={
                                saving ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                ) : (
                                    <Save />
                                )
                            }
                            disabled={saving || loadingRecord}
                        >
                            {saving ? "Updating..." : "Update Custom Field"}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            {/* NOTIFICATION */}

            <Snackbar
                open={notification.open}
                autoHideDuration={5000}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
                onClose={() =>
                    setNotification((previous) => ({
                        ...previous,
                        open: false
                    }))
                }
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
        </>
    );
};

export default VendorItemCustomFieldEdit;

