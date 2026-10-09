import React, { useEffect, useState } from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    MenuItem,
    Typography,
    Divider,
    Box,
    CircularProgress
} from "@mui/material";

import {
    LocationOn,
    Save,
    Close
} from "@mui/icons-material";

/* =========================================================
   INITIAL FORM DATA
========================================================= */

const initialFormData = {
    supplierId: "",
    supplierName: "",
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
   SUPPLIER ADDRESS MODAL
========================================================= */

const SupplierAddressModal = ({
    open,
    onClose,
    onSubmit,
    selectedSupplierAddress = null,
    loading = false,
    suppliers = []
}) => {

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});

    const isEditMode = Boolean(selectedSupplierAddress);

    /* =====================================================
       GET API VALUE
    ===================================================== */

    const getFieldValue = (data, ...keys) => {
        for (const key of keys) {
            if (data?.[key] !== undefined && data?.[key] !== null) {
                return data[key];
            }
        }

        return "";
    };

    /* =====================================================
       RESET / LOAD FORM DATA
    ===================================================== */

    useEffect(() => {
        if (!open) return;

        if (selectedSupplierAddress) {
            setFormData({
                supplierId: getFieldValue(
                    selectedSupplierAddress,
                    "supplierId",
                    "SupplierId"
                ),
                supplierName: getFieldValue(
                    selectedSupplierAddress,
                    "supplierName",
                    "SupplierName"
                ),
                addressType: getFieldValue(
                    selectedSupplierAddress,
                    "addressType",
                    "AddressType"
                ) || "Billing",
                addressLine1: getFieldValue(
                    selectedSupplierAddress,
                    "addressLine1",
                    "AddressLine1"
                ),
                addressLine2: getFieldValue(
                    selectedSupplierAddress,
                    "addressLine2",
                    "AddressLine2"
                ),
                city: getFieldValue(
                    selectedSupplierAddress,
                    "city",
                    "City"
                ),
                state: getFieldValue(
                    selectedSupplierAddress,
                    "state",
                    "State"
                ),
                postalCode: getFieldValue(
                    selectedSupplierAddress,
                    "postalCode",
                    "PostalCode",
                    "zipCode",
                    "ZipCode"
                ),
                country: getFieldValue(
                    selectedSupplierAddress,
                    "country",
                    "Country"
                ) || "India",
                contactPerson: getFieldValue(
                    selectedSupplierAddress,
                    "contactPerson",
                    "ContactPerson"
                ),
                phoneNumber: getFieldValue(
                    selectedSupplierAddress,
                    "phoneNumber",
                    "PhoneNumber"
                ),
                emailAddress: getFieldValue(
                    selectedSupplierAddress,
                    "emailAddress",
                    "EmailAddress"
                ),
                website: getFieldValue(
                    selectedSupplierAddress,
                    "website",
                    "Website"
                ),
                gstNumber: getFieldValue(
                    selectedSupplierAddress,
                    "gstNumber",
                    "GSTNumber"
                ),
                taxNumber: getFieldValue(
                    selectedSupplierAddress,
                    "taxNumber",
                    "TaxNumber"
                ),
                status: getFieldValue(
                    selectedSupplierAddress,
                    "status",
                    "Status"
                ) || "Active"
            });
        } else {
            setFormData(initialFormData);
        }

        setErrors({});
    }, [open, selectedSupplierAddress]);

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
                formData.emailAddress
            )
        ) {
            newErrors.emailAddress = "Enter a valid email address";
        }

        if (
            formData.phoneNumber &&
            !/^[0-9+\-()\s]{7,20}$/.test(
                formData.phoneNumber
            )
        ) {
            newErrors.phoneNumber = "Enter a valid phone number";
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
            ...formData,
            supplierId: Number(formData.supplierId),
            supplierName: String(formData.supplierName || "").trim(),
            addressLine1: String(formData.addressLine1).trim(),
            addressLine2: String(formData.addressLine2 || "").trim(),
            city: String(formData.city).trim(),
            state: String(formData.state).trim(),
            postalCode: String(formData.postalCode).trim(),
            country: String(formData.country).trim(),
            contactPerson: String(formData.contactPerson || "").trim(),
            phoneNumber: String(formData.phoneNumber || "").trim(),
            emailAddress: String(formData.emailAddress || "").trim(),
            website: String(formData.website || "").trim(),
            gstNumber: String(formData.gstNumber || "").trim(),
            taxNumber: String(formData.taxNumber || "").trim()
        };

        onSubmit?.(requestBody);
    };

    /* =====================================================
       RENDER FIELD
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
                size="small"
            />
        </Grid>
    );

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
            >
                {/* =============================================
                   HEADER
                ============================================= */}

                <DialogTitle>
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                    >
                        <LocationOn color="primary" />

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            {isEditMode
                                ? "Edit Supplier Address"
                                : "Add Supplier Address"}
                        </Typography>
                    </Box>
                </DialogTitle>

                <Divider />

                {/* =============================================
                   FORM CONTENT
                ============================================= */}

                <DialogContent dividers>
                    <Grid container spacing={2}>

                        {/* SUPPLIER INFORMATION */}

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
                                onChange={(event) => {
                                    const supplierId = event.target.value;

                                    const supplier = suppliers.find(
                                        (item) =>
                                            String(
                                                item.supplierId ??
                                                item.SupplierId ??
                                                item.id ??
                                                item.Id
                                            ) === String(supplierId)
                                    );

                                    setFormData((previous) => ({
                                        ...previous,
                                        supplierId,
                                        supplierName:
                                            supplier?.supplierName ??
                                            supplier?.SupplierName ??
                                            supplier?.name ??
                                            supplier?.Name ??
                                            ""
                                    }));

                                    setErrors((previous) => ({
                                        ...previous,
                                        supplierId: ""
                                    }));
                                }}
                                error={Boolean(errors.supplierId)}
                                helperText={errors.supplierId || ""}
                                disabled={loading}
                                required
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
                                <MenuItem value="Billing">
                                    Billing
                                </MenuItem>

                                <MenuItem value="Shipping">
                                    Shipping
                                </MenuItem>

                                <MenuItem value="Office">
                                    Office
                                </MenuItem>

                                <MenuItem value="Warehouse">
                                    Warehouse
                                </MenuItem>

                                <MenuItem value="Other">
                                    Other
                                </MenuItem>
                            </TextField>
                        </Grid>

                        {/* ADDRESS DETAILS */}

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

                        {/* CONTACT DETAILS */}

                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />

                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                            >
                                Contact Details
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
                            label: "Website",
                            type: "url"
                        })}

                        {/* TAX DETAILS */}

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

                        {/* STATUS */}

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
                                <MenuItem value="Active">
                                    Active
                                </MenuItem>

                                <MenuItem value="Inactive">
                                    Inactive
                                </MenuItem>
                            </TextField>
                        </Grid>

                    </Grid>
                </DialogContent>

                {/* =============================================
                   ACTIONS
                ============================================= */}

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<Close />}
                        onClick={onClose}
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
                            : isEditMode
                                ? "Update Address"
                                : "Save Address"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default SupplierAddressModal;

