import React, { useEffect, useState } from "react";

import {
    Grid,
    TextField,
    MenuItem,
    Button,
    Box,
    Typography,
    Divider,
    Stack,
    CircularProgress
} from "@mui/material";

import {
    Save,
    RestartAlt,
    ArrowBack,
    LocationOn
} from "@mui/icons-material";

/* =========================================================
   INITIAL FORM DATA
========================================================= */

const initialFormData = {
    supplierId: "",
    addressType: "Billing",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    contactPerson: "",
    phoneNumber: "",
    emailAddress: "",
    website: "",
    gstNumber: "",
    taxNumber: "",
    status: "Active"
};

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (data, ...keys) => {
    for (const key of keys) {
        if (data?.[key] !== undefined && data?.[key] !== null) {
            return data[key];
        }
    }

    return "";
};

/* =========================================================
   SUPPLIER ADDRESS FORM
========================================================= */

const SupplierAddressForm = ({
    initialData = null,
    suppliers = [],
    loading = false,
    onSubmit,
    onCancel
}) => {

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});

    const isEditMode = Boolean(initialData);

    /* =====================================================
       INITIALIZE FORM
    ===================================================== */

    useEffect(() => {
        if (initialData) {
            setFormData({
                supplierId: getFieldValue(
                    initialData,
                    "supplierId",
                    "SupplierId"
                ),
                addressType: getFieldValue(
                    initialData,
                    "addressType",
                    "AddressType"
                ) || "Billing",
                addressLine1: getFieldValue(
                    initialData,
                    "addressLine1",
                    "AddressLine1"
                ),
                addressLine2: getFieldValue(
                    initialData,
                    "addressLine2",
                    "AddressLine2"
                ),
                city: getFieldValue(initialData, "city", "City"),
                state: getFieldValue(initialData, "state", "State"),
                postalCode: getFieldValue(
                    initialData,
                    "postalCode",
                    "PostalCode",
                    "zipCode",
                    "ZipCode"
                ),
                country: getFieldValue(
                    initialData,
                    "country",
                    "Country"
                ) || "India",
                contactPerson: getFieldValue(
                    initialData,
                    "contactPerson",
                    "ContactPerson"
                ),
                phoneNumber: getFieldValue(
                    initialData,
                    "phoneNumber",
                    "PhoneNumber"
                ),
                emailAddress: getFieldValue(
                    initialData,
                    "emailAddress",
                    "EmailAddress"
                ),
                website: getFieldValue(
                    initialData,
                    "website",
                    "Website"
                ),
                gstNumber: getFieldValue(
                    initialData,
                    "gstNumber",
                    "GSTNumber"
                ),
                taxNumber: getFieldValue(
                    initialData,
                    "taxNumber",
                    "TaxNumber"
                ),
                status: getFieldValue(
                    initialData,
                    "status",
                    "Status"
                ) || "Active"
            });
        } else {
            setFormData(initialFormData);
        }

        setErrors({});
    }, [initialData]);

    /* =====================================================
       HANDLE INPUT CHANGE
    ===================================================== */

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: ""
        }));
    };

    /* =====================================================
       HANDLE SUPPLIER CHANGE
    ===================================================== */

    const handleSupplierChange = (event) => {
        const supplierId = event.target.value;

        setFormData((previous) => ({
            ...previous,
            supplierId
        }));

        setErrors((previous) => ({
            ...previous,
            supplierId: ""
        }));
    };

    /* =====================================================
       VALIDATE FORM
    ===================================================== */

    const validateForm = () => {
        const newErrors = {};

        if (
            formData.supplierId === "" ||
            formData.supplierId === null
        ) {
            newErrors.supplierId = "Supplier is required";
        }

        if (!String(formData.addressLine1).trim()) {
            newErrors.addressLine1 = "Address line 1 is required";
        }

        if (!String(formData.city).trim()) {
            newErrors.city = "City is required";
        }

        if (!String(formData.state).trim()) {
            newErrors.state = "State is required";
        }

        if (!String(formData.postalCode).trim()) {
            newErrors.postalCode = "Postal code is required";
        }

        if (!String(formData.country).trim()) {
            newErrors.country = "Country is required";
        }

        if (
            formData.emailAddress &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.emailAddress.trim()
            )
        ) {
            newErrors.emailAddress = "Enter a valid email address";
        }

        if (
            formData.phoneNumber &&
            !/^[0-9+\-()\s]{7,20}$/.test(
                formData.phoneNumber.trim()
            )
        ) {
            newErrors.phoneNumber = "Enter a valid phone number";
        }

        if (
            formData.website &&
            !/^(https?:\/\/)?[\w.-]+\.[a-z]{2,}([/:?#].*)?$/i.test(
                formData.website.trim()
            )
        ) {
            newErrors.website = "Enter a valid website URL";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    /* =====================================================
       HANDLE SUBMIT
    ===================================================== */

    const handleSubmit = (event) => {
        event.preventDefault();

        if (loading || !validateForm()) {
            return;
        }

        const requestBody = {
            supplierId: Number(formData.supplierId),
            addressType: formData.addressType,
            addressLine1: formData.addressLine1.trim(),
            addressLine2: formData.addressLine2.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            postalCode: formData.postalCode.trim(),
            country: formData.country.trim(),
            contactPerson: formData.contactPerson.trim(),
            phoneNumber: formData.phoneNumber.trim(),
            emailAddress: formData.emailAddress.trim(),
            website: formData.website.trim(),
            gstNumber: formData.gstNumber.trim(),
            taxNumber: formData.taxNumber.trim(),
            status: formData.status
        };

        onSubmit?.(requestBody);
    };

    /* =====================================================
       RESET FORM
    ===================================================== */

    const handleReset = () => {
        if (loading) return;

        if (initialData) {
            setFormData({
                supplierId: getFieldValue(
                    initialData,
                    "supplierId",
                    "SupplierId"
                ),
                addressType: getFieldValue(
                    initialData,
                    "addressType",
                    "AddressType"
                ) || "Billing",
                addressLine1: getFieldValue(
                    initialData,
                    "addressLine1",
                    "AddressLine1"
                ),
                addressLine2: getFieldValue(
                    initialData,
                    "addressLine2",
                    "AddressLine2"
                ),
                city: getFieldValue(initialData, "city", "City"),
                state: getFieldValue(initialData, "state", "State"),
                postalCode: getFieldValue(
                    initialData,
                    "postalCode",
                    "PostalCode",
                    "zipCode",
                    "ZipCode"
                ),
                country: getFieldValue(
                    initialData,
                    "country",
                    "Country"
                ) || "India",
                contactPerson: getFieldValue(
                    initialData,
                    "contactPerson",
                    "ContactPerson"
                ),
                phoneNumber: getFieldValue(
                    initialData,
                    "phoneNumber",
                    "PhoneNumber"
                ),
                emailAddress: getFieldValue(
                    initialData,
                    "emailAddress",
                    "EmailAddress"
                ),
                website: getFieldValue(
                    initialData,
                    "website",
                    "Website"
                ),
                gstNumber: getFieldValue(
                    initialData,
                    "gstNumber",
                    "GSTNumber"
                ),
                taxNumber: getFieldValue(
                    initialData,
                    "taxNumber",
                    "TaxNumber"
                ),
                status: getFieldValue(
                    initialData,
                    "status",
                    "Status"
                ) || "Active"
            });
        } else {
            setFormData(initialFormData);
        }

        setErrors({});
    };

    /* =====================================================
       RENDER TEXT FIELD
    ===================================================== */

    const renderField = ({
        name,
        label,
        required = false,
        type = "text",
        multiline = false,
        rows = 1
    }) => (
        <Grid item xs={12} sm={6} key={name}>
            <TextField
                fullWidth
                size="small"
                name={name}
                label={label}
                type={type}
                value={formData[name] ?? ""}
                onChange={handleChange}
                required={required}
                error={Boolean(errors[name])}
                helperText={errors[name] || ""}
                disabled={loading}
                multiline={multiline}
                rows={rows}
            />
        </Grid>
    );

    /* =====================================================
       RENDER FORM
    ===================================================== */

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                width: "100%",
                p: { xs: 2, md: 3 },
                borderRadius: 2,
                bgcolor: "background.paper"
            }}
        >
            {/* =============================================
               FORM HEADER
            ============================================= */}

            <Box
                display="flex"
                alignItems="center"
                gap={1.5}
                mb={3}
            >
                <LocationOn color="primary" fontSize="large" />

                <Box>
                    <Typography
                        variant="h5"
                        fontWeight={700}
                    >
                        {isEditMode
                            ? "Edit Supplier Address"
                            : "Add Supplier Address"}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Enter supplier address and contact details
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2.5}>

                {/* =============================================
                   SUPPLIER INFORMATION
                ============================================= */}

                <Grid item xs={12}>
                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                    >
                        Supplier Information
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        name="supplierId"
                        label="Supplier"
                        value={formData.supplierId ?? ""}
                        onChange={handleSupplierChange}
                        required
                        error={Boolean(errors.supplierId)}
                        helperText={errors.supplierId || ""}
                        disabled={loading}
                    >
                        {suppliers.map((supplier, index) => {
                            const id =
                                supplier.supplierId ??
                                supplier.SupplierId ??
                                supplier.id ??
                                supplier.Id;

                            const name =
                                supplier.supplierName ??
                                supplier.SupplierName ??
                                supplier.name ??
                                supplier.Name;

                            return (
                                <MenuItem
                                    key={id ?? index}
                                    value={id ?? ""}
                                >
                                    {name || `Supplier ${id}`}
                                </MenuItem>
                            );
                        })}
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        name="addressType"
                        label="Address Type"
                        value={formData.addressType}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <MenuItem value="Billing">Billing</MenuItem>
                        <MenuItem value="Shipping">Shipping</MenuItem>
                        <MenuItem value="Office">Office</MenuItem>
                        <MenuItem value="Warehouse">Warehouse</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                </Grid>

                {/* =============================================
                   ADDRESS DETAILS
                ============================================= */}

                <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                    >
                        Address Details
                    </Typography>
                </Grid>

                {renderField({
                    name: "addressLine1",
                    label: "Address Line 1",
                    required: true
                })}

                {renderField({
                    name: "addressLine2",
                    label: "Address Line 2"
                })}

                {renderField({
                    name: "city",
                    label: "City",
                    required: true
                })}

                {renderField({
                    name: "state",
                    label: "State",
                    required: true
                })}

                {renderField({
                    name: "postalCode",
                    label: "Postal Code",
                    required: true
                })}

                {renderField({
                    name: "country",
                    label: "Country",
                    required: true
                })}

                {/* =============================================
                   CONTACT DETAILS
                ============================================= */}

                <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                    >
                        Contact Information
                    </Typography>
                </Grid>

                {renderField({
                    name: "contactPerson",
                    label: "Contact Person"
                })}

                {renderField({
                    name: "phoneNumber",
                    label: "Phone Number",
                    type: "tel"
                })}

                {renderField({
                    name: "emailAddress",
                    label: "Email Address",
                    type: "email"
                })}

                {renderField({
                    name: "website",
                    label: "Website"
                })}

                {/* =============================================
                   TAX DETAILS
                ============================================= */}

                <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />

                    <Typography
                        variant="subtitle1"
                        fontWeight={700}
                    >
                        Tax Information
                    </Typography>
                </Grid>

                {renderField({
                    name: "gstNumber",
                    label: "GST Number"
                })}

                {renderField({
                    name: "taxNumber",
                    label: "Tax Number"
                })}

                {/* =============================================
                   STATUS
                ============================================= */}

                <Grid item xs={12} sm={6}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        name="status"
                        label="Status"
                        value={formData.status}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </TextField>
                </Grid>

            </Grid>

            <Divider sx={{ mt: 3, mb: 2 }} />

            {/* =============================================
               FORM ACTIONS
            ============================================= */}

            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                justifyContent="flex-end"
            >
                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<ArrowBack />}
                    onClick={onCancel}
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
                        : isEditMode
                            ? "Update Address"
                            : "Save Address"}
                </Button>
            </Stack>
        </Box>
    );
};

export default SupplierAddressForm;

