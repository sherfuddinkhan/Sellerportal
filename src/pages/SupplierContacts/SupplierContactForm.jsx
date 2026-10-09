import React, { useEffect, useState } from "react";

import {
    Box,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Typography,
    Divider,
    FormControlLabel,
    Switch,
    Alert,
    CircularProgress,
    Paper
} from "@mui/material";

import {
    Save,
    Cancel,
    PersonAdd,
    Edit
} from "@mui/icons-material";

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
   NORMALIZE BOOLEAN
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
   SUPPLIER CONTACT FORM
========================================================= */

const SupplierContactForm = ({
    supplierContact = null,
    selectedSupplierContact = null,
    suppliers = [],
    loading = false,
    error = "",
    onSubmit,
    onSave,
    onCancel,
    onClose,
    submitLabel,
    title
}) => {
    const contact =
        selectedSupplierContact ?? supplierContact;

    const contactId = getField(
        contact,
        "SupplierContactId",
        "supplierContactId",
        "ContactId",
        "contactId",
        "Id",
        "id"
    );

    const isEdit = Boolean(contactId);

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");

    /* =====================================================
       INITIALIZE FORM
    ===================================================== */

    useEffect(() => {
        if (!contact) {
            setFormData(initialFormData);
        } else {
            setFormData({
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
                email: getField(
                    contact,
                    "Email",
                    "email"
                ),
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
                notes: getField(
                    contact,
                    "Notes",
                    "notes"
                )
            });
        }

        setErrors({});
        setSubmitError("");
    }, [contact]);

    /* =====================================================
       HANDLE INPUT CHANGE
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

        setSubmitError("");
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
                "Alternate phone should differ from the primary phone.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    /* =====================================================
       SUBMIT FORM
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const submitHandler = onSubmit ?? onSave;

        if (!submitHandler) {
            setSubmitError(
                "Submit handler is missing. Pass an onSubmit or onSave callback."
            );
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

        setSubmitError("");

        try {
            await submitHandler(payload, contact);
        } catch (submitException) {
            setSubmitError(
                submitException?.response?.data?.message ||
                submitException?.response?.data?.title ||
                submitException?.message ||
                "Unable to save supplier contact."
            );
        }
    };

    /* =====================================================
       CANCEL FORM
    ===================================================== */

    const handleCancel = () => {
        if (loading) {
            return;
        }

        if (onCancel) {
            onCancel();
        } else {
            onClose?.();
        }
    };

    /* =====================================================
       RENDER FORM
    ===================================================== */

    return (
        <Paper
            elevation={2}
            sx={{
                width: "100%",
                borderRadius: 2,
                overflow: "hidden"
            }}
        >
            {/* FORM HEADER */}
            <Box sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5
                    }}
                >
                    {isEdit ? (
                        <Edit color="primary" fontSize="large" />
                    ) : (
                        <PersonAdd color="primary" fontSize="large" />
                    )}

                    <Box>
                        <Typography variant="h6" fontWeight={600}>
                            {title ||
                                (isEdit
                                    ? "Edit Supplier Contact"
                                    : "Add Supplier Contact")}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {isEdit
                                ? "Update the supplier contact details below."
                                : "Enter the information for the new supplier contact."}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <Divider />

            {/* FORM CONTENT */}
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >
                <Box sx={{ p: 3 }}>
                    {(error || submitError) && (
                        <Alert
                            severity="error"
                            sx={{ mb: 3 }}
                        >
                            {submitError || error}
                        </Alert>
                    )}

                    <Grid container spacing={2.5}>
                        {/* SUPPLIER */}
                        <Grid item xs={12}>
                            <FormControl
                                fullWidth
                                required
                                error={Boolean(errors.supplierId)}
                                disabled={loading}
                            >
                                <InputLabel id="supplier-contact-form-supplier">
                                    Supplier
                                </InputLabel>

                                <Select
                                    labelId="supplier-contact-form-supplier"
                                    name="supplierId"
                                    value={formData.supplierId}
                                    label="Supplier"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">
                                        <em>Select Supplier</em>
                                    </MenuItem>

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
                                        sx={{ mt: 0.5 }}
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
                                disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
                                inputProps={{ maxLength: 254 }}
                            />
                        </Grid>

                        {/* PHONE NUMBER */}
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
                                disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
                                inputProps={{ maxLength: 1000 }}
                            />
                        </Grid>

                        {/* CONTACT STATUS */}
                        <Grid item xs={12}>
                            <Divider sx={{ mb: 2 }} />

                            <Typography
                                variant="subtitle2"
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
                                            disabled={loading}
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
                                            disabled={loading}
                                        />
                                    }
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>

                <Divider />

                {/* FORM ACTIONS */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 2,
                        p: 2.5
                    }}
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
                        type="submit"
                        variant="contained"
                        startIcon={
                            loading ? (
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                            ) : (
                                <Save />
                            )
                        }
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : submitLabel ||
                              (isEdit
                                  ? "Update Contact"
                                  : "Save Contact")}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default SupplierContactForm;

