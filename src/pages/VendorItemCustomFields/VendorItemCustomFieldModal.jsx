import React, {
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    MenuItem,
    FormControlLabel,
    Switch,
    Typography,
    Divider,
    Box,
    CircularProgress,
    Alert,
    IconButton,
    InputAdornment
} from "@mui/material";

import {
    Close,
    Save,
    RestartAlt
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL = "http://localhost:5000/api";

const DEFAULT_API_URL =
    `${API_BASE_URL}/VendorItemCustomField`;

const VENDORS_API_URL =
    `${API_BASE_URL}/Supplier`;

const ITEMS_API_URL =
    `${API_BASE_URL}/Item`;

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
   NORMALIZE API LIST
========================================================= */

const normalizeListResponse = (data) => {
    if (Array.isArray(data)) {
        return data;
    }

    if (!data || typeof data !== "object") {
        return [];
    }

    const possibleLists = [
        data.data,
        data.items,
        data.results,
        data.records,
        data.suppliers,
        data.Suppliers,
        data.itemsList,
        data.Items,
        data.items,
        data.vendorItemCustomFields,
        data.VendorItemCustomFields
    ];

    for (const value of possibleLists) {
        if (Array.isArray(value)) {
            return value;
        }
    }

    return [];
};

/* =========================================================
   INITIAL FORM DATA
========================================================= */

const EMPTY_FORM = {
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
   FIELD TYPES
========================================================= */

const FIELD_TYPES = [
    "Text",
    "Textarea",
    "Number",
    "Decimal",
    "Email",
    "Phone",
    "Date",
    "DateTime",
    "Boolean",
    "Checkbox",
    "Select",
    "Dropdown",
    "Radio",
    "MultiSelect",
    "URL"
];

/* =========================================================
   ERROR MESSAGE
========================================================= */

const getErrorMessage = (error) => {
    const data = error?.response?.data;

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (data && typeof data === "object") {
        if (data.errors && typeof data.errors === "object") {
            return Object.values(data.errors)
                .flat()
                .join(" ");
        }

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
   VENDOR ITEM CUSTOM FIELD MODAL
========================================================= */

const VendorItemCustomFieldModal = ({
    open = false,
    onClose,
    onSuccess,

    vendorItemCustomField = null,
    selectedVendorItemCustomField = null,
    customField = null,

    mode,
    isEdit = false,

    apiUrl = DEFAULT_API_URL,
    vendorsApiUrl = VENDORS_API_URL,
    itemsApiUrl = ITEMS_API_URL,

    vendors: vendorsProp,
    items: itemsProp,

    loadingVendors = false,
    loadingItems = false,

    title
}) => {
    /* =====================================================
       SELECT RECORD
    ===================================================== */

    const selectedRecord =
        vendorItemCustomField ||
        selectedVendorItemCustomField ||
        customField ||
        null;

    const editMode =
        mode === "edit" ||
        isEdit ||
        Boolean(selectedRecord);

    /* =====================================================
       STATE
    ===================================================== */

    const [formData, setFormData] = useState(EMPTY_FORM);

    const [vendors, setVendors] = useState(
        Array.isArray(vendorsProp) ? vendorsProp : []
    );

    const [items, setItems] = useState(
        Array.isArray(itemsProp) ? itemsProp : []
    );

    const [loading, setLoading] = useState(false);
    const [loadingVendorsInternal, setLoadingVendorsInternal] =
        useState(false);
    const [loadingItemsInternal, setLoadingItemsInternal] =
        useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    /* =====================================================
       RESET FORM
    ===================================================== */

    const resetForm = () => {
        setFormData(EMPTY_FORM);
        setFieldErrors({});
        setErrorMessage("");
    };

    /* =====================================================
       POPULATE FORM
    ===================================================== */

    useEffect(() => {
        if (!open) {
            return;
        }

        setErrorMessage("");
        setFieldErrors({});

        if (editMode && selectedRecord) {
            setFormData({
                vendorId:
                    getFieldValue(
                        selectedRecord,
                        "vendorId",
                        "VendorId"
                    ) ?? "",

                itemId:
                    getFieldValue(
                        selectedRecord,
                        "itemId",
                        "ItemId"
                    ) ?? "",

                fieldName:
                    getFieldValue(
                        selectedRecord,
                        "fieldName",
                        "FieldName"
                    ) ?? "",

                fieldLabel:
                    getFieldValue(
                        selectedRecord,
                        "fieldLabel",
                        "FieldLabel"
                    ) ?? "",

                fieldKey:
                    getFieldValue(
                        selectedRecord,
                        "fieldKey",
                        "FieldKey"
                    ) ?? "",

                fieldType:
                    getFieldValue(
                        selectedRecord,
                        "fieldType",
                        "FieldType"
                    ) ?? "Text",

                fieldValue:
                    getFieldValue(
                        selectedRecord,
                        "fieldValue",
                        "FieldValue"
                    ) ?? "",

                defaultValue:
                    getFieldValue(
                        selectedRecord,
                        "defaultValue",
                        "DefaultValue"
                    ) ?? "",

                options: (() => {
                    const value = getFieldValue(
                        selectedRecord,
                        "options",
                        "Options"
                    );

                    if (Array.isArray(value)) {
                        return value.join(", ");
                    }

                    if (value && typeof value === "object") {
                        return JSON.stringify(value);
                    }

                    return value ?? "";
                })(),

                description:
                    getFieldValue(
                        selectedRecord,
                        "description",
                        "Description"
                    ) ?? "",

                displayOrder:
                    getFieldValue(
                        selectedRecord,
                        "displayOrder",
                        "DisplayOrder"
                    ) ?? 0,

                isRequired: Boolean(
                    getFieldValue(
                        selectedRecord,
                        "isRequired",
                        "IsRequired"
                    )
                ),

                isActive: (() => {
                    const value = getFieldValue(
                        selectedRecord,
                        "isActive",
                        "IsActive"
                    );

                    return value === null ? true :
                        value === true ||
                        value === 1 ||
                        String(value).toLowerCase() === "true";
                })()
            });
        } else {
            setFormData(EMPTY_FORM);
        }
    }, [open, editMode, selectedRecord]);

    /* =====================================================
       LOAD VENDORS
    ===================================================== */

    useEffect(() => {
        if (!open || Array.isArray(vendorsProp)) {
            return;
        }

        let cancelled = false;

        const fetchVendors = async () => {
            setLoadingVendorsInternal(true);

            try {
                const response = await axios.get(vendorsApiUrl);

                if (!cancelled) {
                    setVendors(
                        normalizeListResponse(response.data)
                    );
                }
            } catch (error) {
                console.error(
                    "GET VENDORS ERROR:",
                    error
                );

                if (!cancelled) {
                    setVendors([]);
                }
            } finally {
                if (!cancelled) {
                    setLoadingVendorsInternal(false);
                }
            }
        };

        fetchVendors();

        return () => {
            cancelled = true;
        };
    }, [open, vendorsApiUrl, vendorsProp]);

    /* =====================================================
       LOAD ITEMS
    ===================================================== */

    useEffect(() => {
        if (!open || Array.isArray(itemsProp)) {
            return;
        }

        let cancelled = false;

        const fetchItems = async () => {
            setLoadingItemsInternal(true);

            try {
                const response = await axios.get(itemsApiUrl);

                if (!cancelled) {
                    setItems(
                        normalizeListResponse(response.data)
                    );
                }
            } catch (error) {
                console.error(
                    "GET ITEMS ERROR:",
                    error
                );

                if (!cancelled) {
                    setItems([]);
                }
            } finally {
                if (!cancelled) {
                    setLoadingItemsInternal(false);
                }
            }
        };

        fetchItems();

        return () => {
            cancelled = true;
        };
    }, [open, itemsApiUrl, itemsProp]);

    /* =====================================================
       HANDLE INPUT CHANGE
    ===================================================== */

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setFieldErrors((previous) => ({
            ...previous,
            [name]: ""
        }));

        setErrorMessage("");
    };

    /* =====================================================
       HANDLE SWITCH CHANGE
    ===================================================== */

    const handleSwitchChange = (name) => (event) => {
        setFormData((previous) => ({
            ...previous,
            [name]: event.target.checked
        }));
    };

    /* =====================================================
       AUTO-GENERATE FIELD KEY
    ===================================================== */

    const handleFieldNameChange = (event) => {
        const value = event.target.value;

        setFormData((previous) => {
            const previousGeneratedKey = String(
                previous.fieldName || ""
            )
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "_")
                .replace(/^_+|_+$/g, "");

            const currentKey = String(
                previous.fieldKey || ""
            );

            const shouldGenerate =
                !currentKey ||
                currentKey === previousGeneratedKey;

            const generatedKey = value
                .trim()
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "_")
                .replace(/^_+|_+$/g, "");

            return {
                ...previous,
                fieldName: value,
                fieldKey: shouldGenerate
                    ? generatedKey
                    : previous.fieldKey
            };
        });

        setFieldErrors((previous) => ({
            ...previous,
            fieldName: ""
        }));
    };

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {
        const errors = {};

        if (!String(formData.fieldName).trim()) {
            errors.fieldName = "Field name is required.";
        }

        if (!String(formData.fieldLabel).trim()) {
            errors.fieldLabel = "Field label is required.";
        }

        if (!String(formData.fieldKey).trim()) {
            errors.fieldKey = "Field key is required.";
        } else if (
            !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(
                String(formData.fieldKey).trim()
            )
        ) {
            errors.fieldKey =
                "Use letters, numbers and underscores. Start with a letter.";
        }

        if (!String(formData.fieldType).trim()) {
            errors.fieldType = "Field type is required.";
        }

        const normalizedType = String(
            formData.fieldType
        ).toLowerCase();

        const supportsOptions = [
            "select",
            "dropdown",
            "radio",
            "multiselect"
        ].includes(normalizedType);

        if (
            supportsOptions &&
            !String(formData.options).trim()
        ) {
            errors.options =
                "Enter at least one option for this field type.";
        }

        const displayOrder = Number(formData.displayOrder);

        if (
            formData.displayOrder === "" ||
            !Number.isInteger(displayOrder) ||
            displayOrder < 0
        ) {
            errors.displayOrder =
                "Display order must be a non-negative integer.";
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    };

    /* =====================================================
       BUILD API PAYLOAD
    ===================================================== */

    const buildPayload = () => {
        const normalizedType = String(
            formData.fieldType
        ).toLowerCase();

        const supportsOptions = [
            "select",
            "dropdown",
            "radio",
            "multiselect"
        ].includes(normalizedType);

        const options = supportsOptions
            ? String(formData.options)
                .split(",")
                .map((option) => option.trim())
                .filter(Boolean)
            : [];

        const payload = {
            vendorId:
                formData.vendorId === ""
                    ? null
                    : Number(formData.vendorId),

            itemId:
                formData.itemId === ""
                    ? null
                    : Number(formData.itemId),

            fieldName: String(formData.fieldName).trim(),
            fieldLabel: String(formData.fieldLabel).trim(),
            fieldKey: String(formData.fieldKey).trim(),
            fieldType: formData.fieldType,

            fieldValue:
                formData.fieldValue === ""
                    ? null
                    : formData.fieldValue,

            defaultValue:
                formData.defaultValue === ""
                    ? null
                    : formData.defaultValue,

            options,

            description:
                String(formData.description).trim() || null,

            displayOrder: Number(formData.displayOrder),
            isRequired: Boolean(formData.isRequired),
            isActive: Boolean(formData.isActive)
        };

        if (editMode && selectedRecord) {
            const id = getFieldValue(
                selectedRecord,
                "vendorItemCustomFieldId",
                "VendorItemCustomFieldId",
                "id",
                "Id"
            );

            if (id !== null && id !== undefined) {
                payload.vendorItemCustomFieldId = id;
            }
        }

        return payload;
    };

    /* =====================================================
       SUBMIT FORM
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrorMessage("");

        try {
            const payload = buildPayload();

            let response;

            if (editMode) {
                const id = getFieldValue(
                    selectedRecord,
                    "vendorItemCustomFieldId",
                    "VendorItemCustomFieldId",
                    "id",
                    "Id"
                );

                if (id === null || id === undefined) {
                    throw new Error(
                        "Cannot update this record because its ID is missing."
                    );
                }

                response = await axios.put(
                    `${apiUrl}/${id}`,
                    payload
                );
            } else {
                response = await axios.post(
                    apiUrl,
                    payload
                );
            }

            if (onSuccess) {
                await onSuccess(response.data, editMode);
            }

            handleClose();
        } catch (error) {
            console.error(
                "SAVE VENDOR ITEM CUSTOM FIELD ERROR:",
                error
            );

            setErrorMessage(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    const handleClose = () => {
        if (loading) {
            return;
        }

        resetForm();

        if (onClose) {
            onClose();
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    const normalizedType = String(
        formData.fieldType
    ).toLowerCase();

    const showOptions = [
        "select",
        "dropdown",
        "radio",
        "multiselect"
    ].includes(normalizedType);

    const vendorLoading =
        loadingVendors || loadingVendorsInternal;

    const itemLoading =
        loadingItems || loadingItemsInternal;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
        >
            {/* =============================================
                DIALOG TITLE
            ============================================= */}

            <DialogTitle sx={{ pr: 7 }}>
                <Typography
                    variant="h6"
                    fontWeight={700}
                >
                    {title ||
                        (editMode
                            ? "Edit Vendor Item Custom Field"
                            : "Create Vendor Item Custom Field")}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                >
                    Configure the field properties and validation rules.
                </Typography>

                <IconButton
                    onClick={handleClose}
                    disabled={loading}
                    aria-label="Close dialog"
                    sx={{
                        position: "absolute",
                        right: 12,
                        top: 12
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <Divider />

            {/* =============================================
                FORM
            ============================================= */}

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >
                <DialogContent dividers>
                    {errorMessage && (
                        <Alert
                            severity="error"
                            sx={{ mb: 3 }}
                        >
                            {errorMessage}
                        </Alert>
                    )}

                    {/* =====================================
                        ASSOCIATIONS
                    ===================================== */}

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Vendor and Item
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                name="vendorId"
                                label="Vendor"
                                value={formData.vendorId}
                                onChange={handleChange}
                                disabled={loading || vendorLoading}
                                helperText={
                                    vendorLoading
                                        ? "Loading vendors..."
                                        : "Select the vendor for this field."
                                }
                            >
                                <MenuItem value="">
                                    No specific vendor
                                </MenuItem>

                                {vendors.map((vendor, index) => {
                                    const id = getFieldValue(
                                        vendor,
                                        "vendorId",
                                        "VendorId",
                                        "supplierId",
                                        "SupplierId",
                                        "id",
                                        "Id"
                                    );

                                    const name = getFieldValue(
                                        vendor,
                                        "vendorName",
                                        "VendorName",
                                        "supplierName",
                                        "SupplierName",
                                        "name",
                                        "Name"
                                    );

                                    if (id === null || id === undefined) {
                                        return null;
                                    }

                                    return (
                                        <MenuItem
                                            key={id ?? index}
                                            value={String(id)}
                                        >
                                            {name || `Vendor ${id}`}
                                        </MenuItem>
                                    );
                                })}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                name="itemId"
                                label="Item"
                                value={formData.itemId}
                                onChange={handleChange}
                                disabled={loading || itemLoading}
                                helperText={
                                    itemLoading
                                        ? "Loading items..."
                                        : "Select the item for this field."
                                }
                            >
                                <MenuItem value="">
                                    No specific item
                                </MenuItem>

                                {items.map((item, index) => {
                                    const id = getFieldValue(
                                        item,
                                        "itemId",
                                        "ItemId",
                                        "productId",
                                        "ProductId",
                                        "id",
                                        "Id"
                                    );

                                    const name = getFieldValue(
                                        item,
                                        "itemName",
                                        "ItemName",
                                        "productName",
                                        "ProductName",
                                        "name",
                                        "Name"
                                    );

                                    if (id === null || id === undefined) {
                                        return null;
                                    }

                                    return (
                                        <MenuItem
                                            key={id ?? index}
                                            value={String(id)}
                                        >
                                            {name || `Item ${id}`}
                                        </MenuItem>
                                    );
                                })}
                            </TextField>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* =====================================
                        FIELD DETAILS
                    ===================================== */}

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Field Details
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                name="fieldName"
                                label="Field Name"
                                value={formData.fieldName}
                                onChange={handleFieldNameChange}
                                error={Boolean(fieldErrors.fieldName)}
                                helperText={fieldErrors.fieldName}
                                disabled={loading}
                                placeholder="Example: Color"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                name="fieldLabel"
                                label="Field Label"
                                value={formData.fieldLabel}
                                onChange={handleChange}
                                error={Boolean(fieldErrors.fieldLabel)}
                                helperText={fieldErrors.fieldLabel}
                                disabled={loading}
                                placeholder="Example: Product Color"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                name="fieldKey"
                                label="Field Key"
                                value={formData.fieldKey}
                                onChange={handleChange}
                                error={Boolean(fieldErrors.fieldKey)}
                                helperText={
                                    fieldErrors.fieldKey ||
                                    "Unique identifier used by your application."
                                }
                                disabled={loading}
                                placeholder="product_color"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                select
                                fullWidth
                                required
                                name="fieldType"
                                label="Field Type"
                                value={formData.fieldType}
                                onChange={handleChange}
                                error={Boolean(fieldErrors.fieldType)}
                                helperText={fieldErrors.fieldType}
                                disabled={loading}
                            >
                                {FIELD_TYPES.map((type) => (
                                    <MenuItem
                                        key={type}
                                        value={type}
                                    >
                                        {type}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {showOptions && (
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    name="options"
                                    label="Field Options"
                                    value={formData.options}
                                    onChange={handleChange}
                                    error={Boolean(fieldErrors.options)}
                                    helperText={
                                        fieldErrors.options ||
                                        "Enter comma-separated options, e.g. Red, Blue, Green."
                                    }
                                    disabled={loading}
                                    placeholder="Option 1, Option 2, Option 3"
                                />
                            </Grid>
                        )}
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* =====================================
                        FIELD VALUES
                    ===================================== */}

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Default and Current Values
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="defaultValue"
                                label="Default Value"
                                value={formData.defaultValue}
                                onChange={handleChange}
                                disabled={loading}
                                placeholder="Enter default value"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="fieldValue"
                                label="Current Field Value"
                                value={formData.fieldValue}
                                onChange={handleChange}
                                disabled={loading}
                                placeholder="Enter current value"
                            />
                        </Grid>

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
                                placeholder="Describe the purpose of this custom field."
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* =====================================
                        FIELD SETTINGS
                    ===================================== */}

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        sx={{ mb: 2 }}
                    >
                        Field Settings
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                name="displayOrder"
                                label="Display Order"
                                value={formData.displayOrder}
                                onChange={handleChange}
                                error={Boolean(fieldErrors.displayOrder)}
                                helperText={fieldErrors.displayOrder}
                                disabled={loading}
                                inputProps={{
                                    min: 0,
                                    step: 1
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    p: 2,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 2
                                }}
                            >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isRequired}
                                            onChange={handleSwitchChange(
                                                "isRequired"
                                            )}
                                            disabled={loading}
                                        />
                                    }
                                    label="Required Field"
                                />

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ ml: 4.5, mb: 2 }}
                                >
                                    Users must provide a value for this field.
                                </Typography>

                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isActive}
                                            onChange={handleSwitchChange(
                                                "isActive"
                                            )}
                                            disabled={loading}
                                        />
                                    }
                                    label="Active Field"
                                />

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ ml: 4.5 }}
                                >
                                    Enable or disable this custom field.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>

                {/* =========================================
                    DIALOG ACTIONS
                ========================================= */}

                <DialogActions
                    sx={{
                        px: 3,
                        py: 2,
                        gap: 1
                    }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<RestartAlt />}
                        onClick={resetForm}
                        disabled={loading}
                    >
                        Reset
                    </Button>

                    <Box sx={{ flexGrow: 1 }} />

                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={
                            loading
                                ? <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                                : <Save />
                        }
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : editMode
                                ? "Update Field"
                                : "Create Field"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default VendorItemCustomFieldModal;

