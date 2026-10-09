import React, { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Typography,
    Divider,
    Box,
    CircularProgress,
    IconButton,
    Alert
} from "@mui/material";

import {
    Close,
    Save,
    PersonAdd
} from "@mui/icons-material";

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
   FIELD HELPERS
========================================================= */

const getField = (object, ...keys) => {
    for (const key of keys) {
        if (object?.[key] !== undefined && object?.[key] !== null) {
            return object[key];
        }
    }

    return "";
};

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
   SUPPLIER CONTACT MODAL
========================================================= */

const SupplierContactModal = ({
    open = false,
    onClose,
    onSubmit,
    onSave,
    supplierContact = null,
    selectedSupplierContact = null,
    suppliers = [],
    loading = false,
    mode
}) => {
    const contact = selectedSupplierContact ?? supplierContact;

    const isEdit =
        mode === "edit" ||
        Boolean(
            contact &&
            getField(
                contact,
                "SupplierContactId",
                "supplierContactId",
                "ContactId",
                "contactId",
                "Id",
                "id"
            )
        );

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");

    /* =====================================================
       INITIALIZE FORM
    ===================================================== */

    useEffect(() => {
        if (!open) {
            return;
        }

        if (contact) {
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
                isPrimary:
                    getField(
                        contact,
                        "IsPrimary",
                        "isPrimary"
                    ) === true ||
                    String(
                        getField(
                            contact,
                            "IsPrimary",
                            "isPrimary"
                        )
                    ).toLowerCase() === "true",
                isActive:
                    getField(
                        contact,
                        "IsActive",
                        "isActive"
                    ) !== false &&
                    String(
                        getField(
                            contact,
                            "IsActive",
                            "isActive"
                        )
                    ).toLowerCase() !== "false",
                notes: getField(
                    contact,
                    "Notes",
                    "notes"
                )
            });
        } else {
            setFormData(initialFormData);
        }

        setErrors({});
        setSubmitError("");
    }, [open, contact]);

    /* =====================================================
       HANDLE FIELD CHANGE
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

        setSubmitError("");
    };

    /* =====================================================
       VALIDATION
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
            newErrors.email = "Email is required.";
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
                "No save handler was provided. Pass onSubmit or onSave."
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
        } catch (error) {
            setSubmitError(
                error?.response?.data?.message ||
                error?.response?.data?.title ||
                error?.message ||
                "Unable to save supplier contact."
            );
        }
    };

    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    const handleClose = () => {
        if (loading) {
            return;
        }

        setErrors({});
        setSubmitError("");
        onClose?.();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    borderRadius: 2
                }
            }}
        >
            {/* DIALOG HEADER */}
            <DialogTitle>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1
                        }}
                    >
                        <PersonAdd color="primary" />

                        <Box>
                            <Typography variant="h6" fontWeight={600}>
                                {isEdit
                                    ? "Edit Supplier Contact"
                                    : "Add Supplier Contact"}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                {isEdit
                                    ? "Update the contact information."
                                    : "Enter the details of the new contact."}
                            </Typography>
                        </Box>
                    </Box>

                    <IconButton
                        onClick={handleClose}
                        disabled={loading}
                        aria-label="Close dialog"
                    >
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>

            <Divider />

            {/* DIALOG FORM */}
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >
                <DialogContent>
                    {submitError && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                            onClose={() => setSubmitError("")}
                        >
                            {submitError}
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
                                <InputLabel id="supplier-contact-supplier-label">
                                    Supplier
                                </InputLabel>

                                <Select
                                    labelId="supplier-contact-supplier-label"
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

                        {/* CONTACT FLAGS */}
                        <Grid item xs={12}>
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
                                            checked={formData.isPrimary}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    }
                                    label="Primary Contact"
                                />

                                <FormControlLabel
                                    control={
                                        <Switch
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleChange}
                                            disabled={loading}
                                        />
                                    }
                                    label="Active"
                                />
                            </Box>
                        </Grid>

                    </Grid>
                </DialogContent>

                <Divider />

                {/* DIALOG ACTIONS */}
                <DialogActions sx={{ p: 2.5 }}>
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
                                ? <CircularProgress size={18} color="inherit" />
                                : <Save />
                        }
                        disabled={loading}
                    >
                        {loading
                            ? "Saving..."
                            : isEdit
                                ? "Update Contact"
                                : "Save Contact"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default SupplierContactModal;

