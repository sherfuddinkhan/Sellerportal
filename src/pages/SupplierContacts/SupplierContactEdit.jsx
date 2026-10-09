import React, {
    useCallback,
    useEffect,
    useState
} from "react";

import axios from "axios";

import {
    Box,
    Paper,
    Grid,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Divider,
    Switch,
    FormControlLabel,
    CircularProgress,
    Alert,
    Snackbar,
    Breadcrumbs,
    Link
} from "@mui/material";

import {
    Save,
    ArrowBack,
    Edit,
    Person
} from "@mui/icons-material";

/* =========================================================
   API CONFIGURATION
========================================================= */

const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL ||
    "http://localhost:5000/api";

const SUPPLIER_CONTACT_API =
    `${API_BASE_URL}/SupplierContact`;

const SUPPLIER_API =
    `${API_BASE_URL}/Supplier`;

/* =========================================================
   INITIAL FORM DATA
========================================================= */

const initialFormData = {
    supplierId: "",
    contactName: "",
    designation: "",
    department: "",
    email: "",
    phoneNumber: "",
    alternatePhone: "",
    isPrimary: false,
    isActive: true,
    notes: ""
};

/* =========================================================
   RESPONSE NORMALIZER
========================================================= */

const normalizeList = (response) => {
    const data = response?.data;

    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.data)) {
        return data.data;
    }

    if (Array.isArray(data?.items)) {
        return data.items;
    }

    if (Array.isArray(data?.$values)) {
        return data.$values;
    }

    return [];
};

/* =========================================================
   SAFE FIELD ACCESS
========================================================= */

const getField = (object, ...keys) => {
    for (const key of keys) {
        if (
            object?.[key] !== undefined &&
            object?.[key] !== null
        ) {
            return object[key];
        }
    }

    return "";
};

/* =========================================================
   BOOLEAN NORMALIZER
========================================================= */

const toBoolean = (value, defaultValue = false) => {
    if (value === undefined || value === null || value === "") {
        return defaultValue;
    }

    if (typeof value === "string") {
        return value.toLowerCase() === "true";
    }

    return Boolean(value);
};

/* =========================================================
   SUPPLIER HELPERS
========================================================= */

const getSupplierId = (supplier) =>
    getField(
        supplier,
        "SupplierId",
        "supplierId",
        "Id",
        "id"
    );

const getSupplierName = (supplier) =>
    getField(
        supplier,
        "SupplierName",
        "supplierName",
        "Name",
        "name"
    ) || "Unnamed Supplier";

/* =========================================================
   CONTACT ID HELPER
========================================================= */

const getContactId = (contact) =>
    getField(
        contact,
        "SupplierContactId",
        "supplierContactId",
        "ContactId",
        "contactId",
        "Id",
        "id"
    );

/* =========================================================
   MAP CONTACT TO FORM
========================================================= */

const mapContactToForm = (contact) => ({
    supplierId: String(
        getField(contact, "SupplierId", "supplierId")
    ),
    contactName: getField(
        contact,
        "ContactName",
        "contactName",
        "Name",
        "name"
    ),
    designation: getField(
        contact,
        "Designation",
        "designation"
    ),
    department: getField(
        contact,
        "Department",
        "department"
    ),
    email: getField(contact, "Email", "email"),
    phoneNumber: getField(
        contact,
        "PhoneNumber",
        "phoneNumber",
        "Phone",
        "phone"
    ),
    alternatePhone: getField(
        contact,
        "AlternatePhone",
        "alternatePhone"
    ),
    isPrimary: toBoolean(
        getField(contact, "IsPrimary", "isPrimary")
    ),
    isActive: toBoolean(
        getField(contact, "IsActive", "isActive"),
        true
    ),
    notes: getField(contact, "Notes", "notes")
});

/* =========================================================
   SUPPLIER CONTACT EDIT
========================================================= */

const SupplierContactEdit = ({
    supplierContactId,
    contactId,
    supplierContact,
    onBack,
    onCancel,
    onUpdated
}) => {
    const requestedId =
        supplierContactId ??
        contactId ??
        getContactId(supplierContact);

    /* =====================================================
       STATE
    ===================================================== */

    const [formData, setFormData] = useState(initialFormData);
    const [suppliers, setSuppliers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [loadingSuppliers, setLoadingSuppliers] = useState(false);
    const [saving, setSaving] = useState(false);

    const [errors, setErrors] = useState({});
    const [pageError, setPageError] = useState("");

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    /* =====================================================
       NOTIFICATION
    ===================================================== */

    const showNotification = (message, severity = "success") => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    /* =====================================================
       FETCH SUPPLIER CONTACT
    ===================================================== */

    const fetchSupplierContact = useCallback(async () => {
        if (!requestedId && !supplierContact) {
            setPageError("Supplier contact ID is required.");
            return;
        }

        if (supplierContact && !requestedId) {
            setFormData(mapContactToForm(supplierContact));
            return;
        }

        setLoading(true);
        setPageError("");

        try {
            const response = await axios.get(
                `${SUPPLIER_CONTACT_API}/${requestedId}`
            );

            const data =
                response?.data?.data ??
                response?.data?.item ??
                response?.data;

            if (!data || typeof data !== "object") {
                throw new Error(
                    "Supplier contact was not found."
                );
            }

            setFormData(mapContactToForm(data));
        } catch (error) {
            console.error(
                "GET SUPPLIER CONTACT ERROR:",
                error
            );

            setPageError(
                error?.response?.data?.message ||
                error?.response?.data?.title ||
                error?.message ||
                "Failed to load supplier contact."
            );
        } finally {
            setLoading(false);
        }
    }, [requestedId, supplierContact]);

    /* =====================================================
       FETCH SUPPLIERS
    ===================================================== */

    const fetchSuppliers = useCallback(async () => {
        setLoadingSuppliers(true);

        try {
            const response = await axios.get(SUPPLIER_API);

            setSuppliers(normalizeList(response));
        } catch (error) {
            console.error(
                "GET SUPPLIERS ERROR:",
                error
            );

            showNotification(
                "Failed to load suppliers.",
                "error"
            );
        } finally {
            setLoadingSuppliers(false);
        }
    }, []);

    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        fetchSupplierContact();
        fetchSuppliers();
    }, [fetchSupplierContact, fetchSuppliers]);

    /* =====================================================
       HANDLE FIELD CHANGE
    ===================================================== */

    const handleChange = (event) => {
        const {
            name,
            value,
            checked,
            type
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: ""
        }));

        setPageError("");
    };

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {
        const newErrors = {};

        if (!formData.supplierId) {
            newErrors.supplierId = "Please select a supplier.";
        }

        if (!formData.contactName.trim()) {
            newErrors.contactName = "Contact name is required.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email address is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email.trim()
            )
        ) {
            newErrors.email = "Enter a valid email address.";
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone number is required.";
        }

        if (
            formData.alternatePhone.trim() &&
            formData.alternatePhone.trim() ===
                formData.phoneNumber.trim()
        ) {
            newErrors.alternatePhone =
                "Alternate phone must differ from the primary phone.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    /* =====================================================
       UPDATE SUPPLIER CONTACT
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!requestedId) {
            setPageError("Supplier contact ID is missing.");
            return;
        }

        const payload = {
            supplierId: Number(formData.supplierId),
            contactName: formData.contactName.trim(),
            designation: formData.designation.trim(),
            department: formData.department.trim(),
            email: formData.email.trim(),
            phoneNumber: formData.phoneNumber.trim(),
            alternatePhone: formData.alternatePhone.trim(),
            isPrimary: formData.isPrimary,
            isActive: formData.isActive,
            notes: formData.notes.trim()
        };

        setSaving(true);
        setPageError("");

        try {
            const response = await axios.put(
                `${SUPPLIER_CONTACT_API}/${requestedId}`,
                payload
            );

            showNotification(
                "Supplier contact updated successfully.",
                "success"
            );

            if (onUpdated) {
                await onUpdated(
                    response.data,
                    payload
                );
            }
        } catch (error) {
            console.error(
                "UPDATE SUPPLIER CONTACT ERROR:",
                error
            );

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.title ||
                error?.message ||
                "Failed to update supplier contact.";

            setPageError(message);

            showNotification(message, "error");
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       NAVIGATION
    ===================================================== */

    const handleBack = () => {
        if (saving) {
            return;
        }

        if (onBack) {
            onBack();
        } else if (onCancel) {
            onCancel();
        }
    };

    /* =====================================================
       LOADING VIEW
    ===================================================== */

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: 300,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2
                }}
            >
                <CircularProgress />

                <Typography color="text.secondary">
                    Loading supplier contact...
                </Typography>
            </Box>
        );
    }

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ width: "100%", p: { xs: 1, md: 3 } }}>
            {/* BREADCRUMBS */}
            <Breadcrumbs sx={{ mb: 2 }}>
                <Link
                    component="button"
                    underline="hover"
                    color="inherit"
                    onClick={handleBack}
                    disabled={saving}
                >
                    Supplier Contacts
                </Link>

                <Typography color="text.primary">
                    Edit Contact
                </Typography>
            </Breadcrumbs>

            {/* PAGE HEADER */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 3
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                    }}
                >
                    <Edit color="primary" fontSize="large" />

                    <Box>
                        <Typography
                            variant="h5"
                            fontWeight={600}
                        >
                            Edit Supplier Contact
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Update contact information and settings.
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    disabled={saving}
                >
                    Back
                </Button>
            </Box>

            {/* ERROR MESSAGE */}
            {pageError && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setPageError("")}
                >
                    {pageError}
                </Alert>
            )}

            {/* EDIT FORM */}
            <Paper
                elevation={2}
                sx={{
                    borderRadius: 2,
                    overflow: "hidden"
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2
                        }}
                    >
                        <Person color="primary" />

                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            Contact Information
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <Grid container spacing={2.5}>
                            {/* SUPPLIER */}
                            <Grid item xs={12}>
                                <FormControl
                                    fullWidth
                                    required
                                    error={Boolean(errors.supplierId)}
                                    disabled={
                                        saving || loadingSuppliers
                                    }
                                >
                                    <InputLabel id="edit-contact-supplier-label">
                                        Supplier
                                    </InputLabel>

                                    <Select
                                        labelId="edit-contact-supplier-label"
                                        name="supplierId"
                                        value={formData.supplierId}
                                        label="Supplier"
                                        onChange={handleChange}
                                    >
                                        {suppliers.map((supplier, index) => {
                                            const id = getSupplierId(supplier);

                                            if (id === "") {
                                                return null;
                                            }

                                            return (
                                                <MenuItem
                                                    key={id || index}
                                                    value={String(id)}
                                                >
                                                    {getSupplierName(supplier)}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>

                                    {errors.supplierId && (
                                        <Typography
                                            variant="caption"
                                            color="error"
                                        >
                                            {errors.supplierId}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* CONTACT NAME */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    name="contactName"
                                    label="Contact Name"
                                    value={formData.contactName}
                                    onChange={handleChange}
                                    error={Boolean(errors.contactName)}
                                    helperText={errors.contactName}
                                    disabled={saving}
                                    inputProps={{ maxLength: 150 }}
                                />
                            </Grid>

                            {/* DESIGNATION */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="designation"
                                    label="Designation"
                                    value={formData.designation}
                                    onChange={handleChange}
                                    disabled={saving}
                                    inputProps={{ maxLength: 100 }}
                                />
                            </Grid>

                            {/* DEPARTMENT */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="department"
                                    label="Department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    disabled={saving}
                                    inputProps={{ maxLength: 100 }}
                                />
                            </Grid>

                            {/* EMAIL */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="email"
                                    name="email"
                                    label="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={Boolean(errors.email)}
                                    helperText={errors.email}
                                    disabled={saving}
                                    inputProps={{ maxLength: 254 }}
                                />
                            </Grid>

                            {/* PHONE */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    name="phoneNumber"
                                    label="Phone Number"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    error={Boolean(errors.phoneNumber)}
                                    helperText={errors.phoneNumber}
                                    disabled={saving}
                                    inputProps={{ maxLength: 30 }}
                                />
                            </Grid>

                            {/* ALTERNATE PHONE */}
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    name="alternatePhone"
                                    label="Alternate Phone"
                                    value={formData.alternatePhone}
                                    onChange={handleChange}
                                    error={Boolean(errors.alternatePhone)}
                                    helperText={errors.alternatePhone}
                                    disabled={saving}
                                    inputProps={{ maxLength: 30 }}
                                />
                            </Grid>

                            {/* NOTES */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    name="notes"
                                    label="Notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    disabled={saving}
                                    inputProps={{ maxLength: 1000 }}
                                />
                            </Grid>

                            {/* STATUS SETTINGS */}
                            <Grid item xs={12}>
                                <Divider sx={{ mb: 2 }} />

                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    sx={{ mb: 1 }}
                                >
                                    Contact Settings
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: 3
                                    }}
                                >
                                    <FormControlLabel
                                        label="Primary Contact"
                                        control={
                                            <Switch
                                                name="isPrimary"
                                                checked={formData.isPrimary}
                                                onChange={handleChange}
                                                disabled={saving}
                                            />
                                        }
                                    />

                                    <FormControlLabel
                                        label="Active Contact"
                                        control={
                                            <Switch
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleChange}
                                                disabled={saving}
                                            />
                                        }
                                    />
                                </Box>
                            </Grid>
                        </Grid>

                        {/* FORM ACTIONS */}
                        <Divider sx={{ my: 3 }} />

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                flexWrap: "wrap",
                                gap: 2
                            }}
                        >
                            <Button
                                variant="outlined"
                                startIcon={<ArrowBack />}
                                onClick={handleBack}
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
                                disabled={saving}
                            >
                                {saving
                                    ? "Updating..."
                                    : "Update Contact"}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            {/* NOTIFICATION */}
            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
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
        </Box>
    );
};

export default SupplierContactEdit;

