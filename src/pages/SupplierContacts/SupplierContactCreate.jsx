import React, { useEffect, useState } from "react";

import axios from "axios";

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Divider,
    CircularProgress,
    Alert,
    Breadcrumbs,
    Link,
    Snackbar
} from "@mui/material";

import {
    Save,
    ArrowBack,
    PersonAdd,
    Clear
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
   GET FIELD VALUE
   Supports camelCase and PascalCase responses
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
   INITIAL FORM STATE
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
   COMPONENT
========================================================= */

const SupplierContactCreate = ({
    onCreated,
    onCancel,
    onBack,
    suppliers: suppliedSuppliers = [],
    title = "Create Supplier Contact"
}) => {
    const [formData, setFormData] = useState(initialFormData);

    const [suppliers, setSuppliers] = useState(
        suppliedSuppliers
    );

    const [loadingSuppliers, setLoadingSuppliers] =
        useState(false);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [fieldErrors, setFieldErrors] = useState({});

    /* =====================================================
       FETCH SUPPLIERS
    ===================================================== */

    const fetchSuppliers = async () => {
        if (suppliedSuppliers.length > 0) {
            setSuppliers(suppliedSuppliers);
            return;
        }

        setLoadingSuppliers(true);

        try {
            const response = await axios.get(SUPPLIER_API);

            const responseData = response.data;

            const supplierList = Array.isArray(responseData)
                ? responseData
                : Array.isArray(responseData?.data)
                    ? responseData.data
                    : Array.isArray(responseData?.items)
                        ? responseData.items
                        : Array.isArray(responseData?.$values)
                            ? responseData.$values
                            : [];

            setSuppliers(supplierList);
        } catch (err) {
            console.error(
                "GET SUPPLIERS ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                err.response?.data?.title ||
                "Failed to load suppliers."
            );
        } finally {
            setLoadingSuppliers(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    useEffect(() => {
        setSuppliers(suppliedSuppliers);
    }, [suppliedSuppliers]);

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

        setError("");
    };

    /* =====================================================
       HANDLE SWITCH CHANGE
    ===================================================== */

    const handleSwitchChange = (event) => {
        const { name, checked } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: checked
        }));
    };

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {
        const errors = {};

        if (!formData.supplierId) {
            errors.supplierId = "Please select a supplier.";
        }

        if (!formData.contactName.trim()) {
            errors.contactName = "Contact name is required.";
        }

        if (!formData.email.trim()) {
            errors.email = "Email address is required.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email.trim()
            )
        ) {
            errors.email = "Enter a valid email address.";
        }

        if (!formData.phoneNumber.trim()) {
            errors.phoneNumber = "Phone number is required.";
        } else if (
            !/^[+]?[\d\s()-]{7,20}$/.test(
                formData.phoneNumber.trim()
            )
        ) {
            errors.phoneNumber =
                "Enter a valid phone number.";
        }

        if (
            formData.alternatePhone.trim() &&
            !/^[+]?[\d\s()-]{7,20}$/.test(
                formData.alternatePhone.trim()
            )
        ) {
            errors.alternatePhone =
                "Enter a valid alternate phone number.";
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    };

    /* =====================================================
       RESET FORM
    ===================================================== */

    const handleReset = () => {
        setFormData(initialFormData);
        setFieldErrors({});
        setError("");
    };

    /* =====================================================
       CANCEL
    ===================================================== */

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else if (onBack) {
            onBack();
        }
    };

    /* =====================================================
       CREATE SUPPLIER CONTACT
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        const payload = {
            supplierId: Number(formData.supplierId),
            contactName: formData.contactName.trim(),
            designation: formData.designation.trim(),
            department: formData.department.trim(),
            email: formData.email.trim(),
            phoneNumber: formData.phoneNumber.trim(),
            alternatePhone:
                formData.alternatePhone.trim(),
            isPrimary: formData.isPrimary,
            isActive: formData.isActive,
            notes: formData.notes.trim()
        };

        setSaving(true);

        try {
            const response = await axios.post(
                SUPPLIER_CONTACT_API,
                payload
            );

            const createdContact = response.data;

            setSuccess(
                "Supplier contact created successfully."
            );

            if (onCreated) {
                onCreated(createdContact || payload);
            }

            setFormData(initialFormData);
            setFieldErrors({});
        } catch (err) {
            console.error(
                "CREATE SUPPLIER CONTACT ERROR:",
                err
            );

            const responseData = err.response?.data;

            if (
                responseData?.errors &&
                typeof responseData.errors === "object"
            ) {
                const validationErrors = {};

                Object.entries(responseData.errors).forEach(
                    ([key, messages]) => {
                        const normalizedKey =
                            key.charAt(0).toLowerCase() +
                            key.slice(1);

                        validationErrors[normalizedKey] =
                            Array.isArray(messages)
                                ? messages.join(" ")
                                : String(messages);
                    }
                );

                setFieldErrors(validationErrors);
            }

            setError(
                responseData?.message ||
                responseData?.title ||
                responseData?.detail ||
                "Failed to create supplier contact. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>

            {/* PAGE HEADER */}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                        xs: "flex-start",
                        sm: "center"
                    },
                    flexDirection: {
                        xs: "column",
                        sm: "row"
                    },
                    gap: 2,
                    mb: 3
                }}
            >
                <Box>
                    <Breadcrumbs sx={{ mb: 1 }}>
                        <Link
                            component="button"
                            type="button"
                            underline="hover"
                            color="inherit"
                            onClick={handleCancel}
                        >
                            Supplier Contacts
                        </Link>

                        <Typography color="text.primary">
                            Create
                        </Typography>
                    </Breadcrumbs>

                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                    >
                        Add a new contact for a supplier.
                    </Typography>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<ArrowBack />}
                    onClick={handleCancel}
                    disabled={saving}
                >
                    Back
                </Button>
            </Box>

            {/* ERROR MESSAGE */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            {/* CREATE FORM */}

            <Paper
                elevation={2}
                sx={{
                    borderRadius: 2,
                    overflow: "hidden"
                }}
            >
                <Box
                    sx={{
                        p: 2.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                    }}
                >
                    <PersonAdd color="primary" />

                    <Box>
                        <Typography
                            variant="h6"
                            fontWeight={600}
                        >
                            Contact Information
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Enter the contact details below.
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ p: { xs: 2, sm: 3 } }}
                >
                    <Grid container spacing={2.5}>

                        {/* SUPPLIER */}

                        <Grid item xs={12} md={6}>
                            <FormControl
                                fullWidth
                                required
                                error={Boolean(
                                    fieldErrors.supplierId
                                )}
                            >
                                <InputLabel>
                                    Supplier
                                </InputLabel>

                                <Select
                                    name="supplierId"
                                    value={formData.supplierId}
                                    label="Supplier"
                                    onChange={handleChange}
                                    disabled={
                                        saving ||
                                        loadingSuppliers
                                    }
                                >
                                    <MenuItem value="">
                                        <em>
                                            Select Supplier
                                        </em>
                                    </MenuItem>

                                    {suppliers.map((supplier) => {
                                        const supplierId =
                                            getField(
                                                supplier,
                                                "supplierId",
                                                "SupplierId",
                                                "id",
                                                "Id"
                                            );

                                        const supplierName =
                                            getField(
                                                supplier,
                                                "supplierName",
                                                "SupplierName",
                                                "name",
                                                "Name",
                                                "companyName",
                                                "CompanyName"
                                            );

                                        return (
                                            <MenuItem
                                                key={supplierId}
                                                value={String(
                                                    supplierId
                                                )}
                                            >
                                                {supplierName ||
                                                    `Supplier ${supplierId}`}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>

                                {fieldErrors.supplierId && (
                                    <Typography
                                        variant="caption"
                                        color="error"
                                        sx={{ mt: 0.5, ml: 1.5 }}
                                    >
                                        {fieldErrors.supplierId}
                                    </Typography>
                                )}

                                {loadingSuppliers && (
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ mt: 0.5 }}
                                    >
                                        Loading suppliers...
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        {/* CONTACT NAME */}

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Contact Name"
                                name="contactName"
                                value={formData.contactName}
                                onChange={handleChange}
                                error={Boolean(
                                    fieldErrors.contactName
                                )}
                                helperText={
                                    fieldErrors.contactName
                                }
                                disabled={saving}
                                inputProps={{
                                    maxLength: 150
                                }}
                            />
                        </Grid>

                        {/* DESIGNATION */}

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Designation"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                disabled={saving}
                                inputProps={{
                                    maxLength: 100
                                }}
                            />
                        </Grid>

                        {/* DEPARTMENT */}

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                disabled={saving}
                                inputProps={{
                                    maxLength: 100
                                }}
                            />
                        </Grid>

                        {/* EMAIL */}

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                type="email"
                                label="Email Address"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={Boolean(
                                    fieldErrors.email
                                )}
                                helperText={fieldErrors.email}
                                disabled={saving}
                                inputProps={{
                                    maxLength: 254
                                }}
                            />
                        </Grid>

                        {/* PHONE */}

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Phone Number"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                error={Boolean(
                                    fieldErrors.phoneNumber
                                )}
                                helperText={
                                    fieldErrors.phoneNumber
                                }
                                disabled={saving}
                                inputProps={{
                                    maxLength: 20
                                }}
                            />
                        </Grid>

                        {/* ALTERNATE PHONE */}

                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Alternate Phone"
                                name="alternatePhone"
                                value={formData.alternatePhone}
                                onChange={handleChange}
                                error={Boolean(
                                    fieldErrors.alternatePhone
                                )}
                                helperText={
                                    fieldErrors.alternatePhone
                                }
                                disabled={saving}
                                inputProps={{
                                    maxLength: 20
                                }}
                            />
                        </Grid>

                        {/* NOTES */}

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={3}
                                label="Notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                disabled={saving}
                                inputProps={{
                                    maxLength: 1000
                                }}
                            />
                        </Grid>

                        {/* STATUS OPTIONS */}

                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />

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
                                    control={
                                        <Switch
                                            name="isPrimary"
                                            checked={
                                                formData.isPrimary
                                            }
                                            onChange={
                                                handleSwitchChange
                                            }
                                            disabled={saving}
                                        />
                                    }
                                    label="Primary Contact"
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            name="isActive"
                                            checked={
                                                formData.isActive
                                            }
                                            onChange={
                                                handleSwitchChange
                                            }
                                            disabled={saving}
                                        />
                                    }
                                    label="Active Contact"
                                />
                            </Box>
                        </Grid>

                        {/* ACTION BUTTONS */}

                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />

                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    flexWrap: "wrap",
                                    gap: 1.5,
                                    mt: 2
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    startIcon={<Clear />}
                                    onClick={handleReset}
                                    disabled={saving}
                                >
                                    Clear
                                </Button>

                                <Button
                                    variant="outlined"
                                    startIcon={<ArrowBack />}
                                    onClick={handleCancel}
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
                                    disabled={
                                        saving ||
                                        loadingSuppliers
                                    }
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Create Contact"}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>

            {/* SUCCESS MESSAGE */}

            <Snackbar
                open={Boolean(success)}
                autoHideDuration={4000}
                onClose={() => setSuccess("")}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => setSuccess("")}
                >
                    {success}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default SupplierContactCreate;

