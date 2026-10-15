
import React, { useEffect, useState } from "react";

import {
    Box,
    Grid,
    TextField,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Button,
    Typography,
    Divider,
    Alert,
    CircularProgress,
    Stack
} from "@mui/material";

import {
    Save,
    RestartAlt,
    LocationOn
} from "@mui/icons-material";

// ============================================================
// INITIAL FORM VALUES
// ============================================================

const initialFormData = {
    contactName: "",
    contactPerson: "",
    phoneNumber: "",
    alternatePhoneNumber: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    addressType: "PICKUP",
    isDefault: false,
    isActive: true
};

// ============================================================
// FIELD VALUE HELPER
// ============================================================

const getFieldValue = (source, aliases, fallback = "") => {
    for (const key of aliases) {
        const value = source?.[key];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return fallback;
};

// ============================================================
// MAP API ADDRESS TO FORM
// ============================================================

const mapAddressToForm = (address = {}) => {
    const addressType = getFieldValue(
        address,
        ["addressType", "AddressType"],
        "PICKUP"
    );

    return {
        contactName: getFieldValue(
            address,
            ["contactName", "ContactName", "name", "Name"]
        ),

        contactPerson: getFieldValue(
            address,
            ["contactPerson", "ContactPerson"]
        ),

        phoneNumber: getFieldValue(
            address,
            [
                "phoneNumber",
                "PhoneNumber",
                "phone",
                "Phone",
                "mobileNumber",
                "MobileNumber"
            ]
        ),

        alternatePhoneNumber: getFieldValue(
            address,
            [
                "alternatePhoneNumber",
                "AlternatePhoneNumber",
                "alternatePhone",
                "AlternatePhone"
            ]
        ),

        email: getFieldValue(
            address,
            ["email", "Email", "emailAddress", "EmailAddress"]
        ),

        addressLine1: getFieldValue(
            address,
            ["addressLine1", "AddressLine1", "address1", "Address1"]
        ),

        addressLine2: getFieldValue(
            address,
            ["addressLine2", "AddressLine2", "address2", "Address2"]
        ),

        landmark: getFieldValue(
            address,
            ["landmark", "Landmark"]
        ),

        city: getFieldValue(
            address,
            ["city", "City"]
        ),

        state: getFieldValue(
            address,
            ["state", "State", "stateName", "StateName"]
        ),

        postalCode: getFieldValue(
            address,
            [
                "postalCode",
                "PostalCode",
                "zipCode",
                "ZipCode",
                "pinCode",
                "PinCode",
                "pincode",
                "Pincode"
            ]
        ),

        country: getFieldValue(
            address,
            ["country", "Country"],
            "India"
        ),

        addressType,

        isDefault: Boolean(
            getFieldValue(
                address,
                [
                    "isDefault",
                    "IsDefault",
                    "defaultAddress",
                    "DefaultAddress"
                ],
                false
            )
        ),

        isActive: Boolean(
            getFieldValue(
                address,
                ["isActive", "IsActive", "active", "Active"],
                true
            )
        )
    };
};

// ============================================================
// ADDRESS TYPE OPTIONS
// The value sent to the API is separate from its display label.
// ============================================================

const DEFAULT_ADDRESS_TYPES = [
    { value: "PICKUP", label: "Pickup Address" },
    { value: "RETURN", label: "Return Address" },
    { value: "Home", label: "Home" },
    { value: "Office", label: "Office" },
    { value: "Warehouse", label: "Warehouse" },
    { value: "Other", label: "Other" }
];

const DEFAULT_COUNTRIES = [
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Other"
];

// ============================================================
// REVERSE PICKUP ADDRESS FORM
// ============================================================

const ReversePickupAddressForm = ({
    address = null,
    initialValues = null,
    mode = "create",
    onSubmit,
    onCancel,
    onReset,
    loading = false,
    submitting = false,
    error = "",
    success = "",
    formId = "reverse-pickup-address-form",
    submitLabel,
    showActions = true,
    showCancelButton = false,
    disabled = false,
    addressTypes = DEFAULT_ADDRESS_TYPES,
    countries = DEFAULT_COUNTRIES
}) => {
    const normalizedMode = String(mode || "create")
        .trim()
        .toLowerCase();

    const isEditMode = ["edit", "update"].includes(normalizedMode);

    const isViewMode = [
        "view",
        "details",
        "read"
    ].includes(normalizedMode);

    const isBusy = Boolean(loading || submitting);

    const isDisabled = disabled || isBusy || isViewMode;

    // --------------------------------------------------------
    // Normalize options so the dropdown can accept either
    // ["Home", "Office"] or [{value, label}, ...].
    // --------------------------------------------------------

    const normalizedAddressTypes = (
        Array.isArray(addressTypes) && addressTypes.length
            ? addressTypes
            : DEFAULT_ADDRESS_TYPES
    ).map((item) => {
        if (typeof item === "string") {
            const matching = DEFAULT_ADDRESS_TYPES.find(
                (option) => option.value === item
            );

            return matching || {
                value: item,
                label: item
            };
        }

        return {
            value: String(item.value ?? item.label ?? ""),
            label: String(item.label ?? item.value ?? "")
        };
    }).filter((item) => item.value !== "");

    const normalizedCountries = (
        Array.isArray(countries) && countries.length
            ? countries
            : DEFAULT_COUNTRIES
    ).map((country) => {
        if (typeof country === "string") {
            return {
                value: country,
                label: country
            };
        }

        return {
            value: String(country.value ?? country.label ?? ""),
            label: String(country.label ?? country.value ?? "")
        };
    }).filter((item) => item.value !== "");

    // --------------------------------------------------------
    // FORM STATE
    // --------------------------------------------------------

    const [formData, setFormData] = useState(() => ({
        ...initialFormData,
        ...mapAddressToForm(initialValues || address || {})
    }));

    const [fieldErrors, setFieldErrors] = useState({});

    // --------------------------------------------------------
    // RESET FORM WHEN THE ADDRESS CHANGES
    // --------------------------------------------------------

    useEffect(() => {
        const source = initialValues || address || {};

        setFormData({
            ...initialFormData,
            ...mapAddressToForm(source)
        });

        setFieldErrors({});
    }, [address, initialValues, mode]);

    // --------------------------------------------------------
    // HANDLE INPUT CHANGE
    // --------------------------------------------------------

    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked
        } = event.target;

        const nextValue = type === "checkbox" ? checked : value;

        setFormData((previous) => ({
            ...previous,
            [name]: nextValue
        }));

        setFieldErrors((previous) => ({
            ...previous,
            [name]: ""
        }));
    };

    // --------------------------------------------------------
    // VALIDATE FORM
    // --------------------------------------------------------

    const validateForm = () => {
        const errors = {};

        if (!String(formData.contactName).trim()) {
            errors.contactName = "Contact name is required.";
        }

        if (!String(formData.phoneNumber).trim()) {
            errors.phoneNumber = "Phone number is required.";
        } else {
            const digits = String(formData.phoneNumber)
                .replace(/\D/g, "");

            if (digits.length < 7 || digits.length > 15) {
                errors.phoneNumber = "Enter a valid phone number.";
            }
        }

        if (String(formData.alternatePhoneNumber || "").trim()) {
            const digits = String(formData.alternatePhoneNumber)
                .replace(/\D/g, "");

            if (digits.length < 7 || digits.length > 15) {
                errors.alternatePhoneNumber =
                    "Enter a valid alternate phone number.";
            }
        }

        // Correct email validation regex.
        if (
            String(formData.email || "").trim() &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                String(formData.email).trim()
            )
        ) {
            errors.email = "Enter a valid email address.";
        }

        if (!String(formData.addressLine1).trim()) {
            errors.addressLine1 = "Address line 1 is required.";
        }

        if (!String(formData.city).trim()) {
            errors.city = "City is required.";
        }

        if (!String(formData.state).trim()) {
            errors.state = "State is required.";
        }

        if (!String(formData.postalCode).trim()) {
            errors.postalCode = "Postal code is required.";
        } else if (String(formData.postalCode).trim().length > 20) {
            errors.postalCode =
                "Postal code cannot exceed 20 characters.";
        }

        if (!String(formData.country).trim()) {
            errors.country = "Country is required.";
        }

        if (!String(formData.addressType).trim()) {
            errors.addressType = "Address type is required.";
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    };

    // --------------------------------------------------------
    // SUBMIT FORM
    // --------------------------------------------------------

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isBusy || disabled || isViewMode) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        if (typeof onSubmit !== "function") {
            return;
        }

        onSubmit({
            ...formData,
            contactName: String(formData.contactName).trim(),
            contactPerson: String(formData.contactPerson || "").trim(),
            phoneNumber: String(formData.phoneNumber).trim(),
            alternatePhoneNumber: String(
                formData.alternatePhoneNumber || ""
            ).trim(),
            email: String(formData.email || "").trim(),
            addressLine1: String(formData.addressLine1).trim(),
            addressLine2: String(formData.addressLine2 || "").trim(),
            landmark: String(formData.landmark || "").trim(),
            city: String(formData.city).trim(),
            state: String(formData.state).trim(),
            postalCode: String(formData.postalCode).trim(),
            country: String(formData.country).trim(),
            addressType: String(formData.addressType).trim()
        });
    };

    // --------------------------------------------------------
    // RESET FORM
    // --------------------------------------------------------

    const handleReset = () => {
        if (isBusy || disabled || isViewMode) {
            return;
        }

        const source = initialValues || address || {};

        setFormData({
            ...initialFormData,
            ...mapAddressToForm(source)
        });

        setFieldErrors({});

        if (typeof onReset === "function") {
            onReset();
        }
    };

    // --------------------------------------------------------
    // TEXT FIELD HELPER
    // --------------------------------------------------------

    const renderTextField = ({
        name,
        label,
        required = false,
        multiline = false,
        rows = 1,
        type = "text",
        maxLength,
        placeholder,
        autoComplete
    }) => (
        <TextField
            fullWidth
            name={name}
            label={label}
            type={type}
            value={formData[name] ?? ""}
            onChange={handleChange}
            required={required}
            disabled={isDisabled}
            multiline={multiline}
            rows={rows}
            placeholder={placeholder}
            autoComplete={autoComplete}
            error={Boolean(fieldErrors[name])}
            helperText={fieldErrors[name] || " "}
            inputProps={
                maxLength ? { maxLength } : undefined
            }
            size="small"
        />
    );

    // --------------------------------------------------------
    // RENDER
    // --------------------------------------------------------

    return (
        <Box
            component="form"
            id={formId}
            onSubmit={handleSubmit}
            noValidate
            sx={{ width: "100%" }}
        >
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            {/* CONTACT INFORMATION */}

            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 2 }}
            >
                <LocationOn color="primary" />

                <Typography variant="subtitle1" fontWeight={700}>
                    Contact Information
                </Typography>
            </Stack>

            <Grid container spacing={2}>
                <Grid xs={12} sm={6}>
                    {renderTextField({
                        name: "contactName",
                        label: "Contact Name",
                        required: true,
                        maxLength: 150,
                        autoComplete: "name"
                    })}
                </Grid>

                <Grid xs={12} sm={6}>
                    {renderTextField({
                        name: "contactPerson",
                        label: "Contact Person",
                        maxLength: 150
                    })}
                </Grid>

                <Grid xs={12} sm={6}>
                    {renderTextField({
                        name: "phoneNumber",
                        label: "Phone Number",
                        required: true,
                        maxLength: 20,
                        autoComplete: "tel"
                    })}
                </Grid>

                <Grid xs={12} sm={6}>
                    {renderTextField({
                        name: "alternatePhoneNumber",
                        label: "Alternate Phone Number",
                        maxLength: 20
                    })}
                </Grid>

                <Grid xs={12}>
                    {renderTextField({
                        name: "email",
                        label: "Email Address",
                        type: "email",
                        maxLength: 254,
                        autoComplete: "email"
                    })}
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* ADDRESS INFORMATION */}

            <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mb: 2 }}
            >
                Address Information
            </Typography>

            <Grid container spacing={2}>
                <Grid xs={12}>
                    {renderTextField({
                        name: "addressLine1",
                        label: "Address Line 1",
                        required: true,
                        maxLength: 250,
                        placeholder: "Building, street, or house number"
                    })}
                </Grid>

                <Grid xs={12}>
                    {renderTextField({
                        name: "addressLine2",
                        label: "Address Line 2",
                        maxLength: 250,
                        placeholder: "Area, locality, or additional details"
                    })}
                </Grid>

                <Grid xs={12} sm={6}>
                    {renderTextField({
                        name: "landmark",
                        label: "Landmark",
                        maxLength: 150
                    })}
                </Grid>

                <Grid xs={12} sm={6}>
                    {renderTextField({
                        name: "city",
                        label: "City",
                        required: true,
                        maxLength: 100
                    })}
                </Grid>

                <Grid xs={12} sm={6}>
                    {renderTextField({
                        name: "state",
                        label: "State / Province",
                        required: true,
                        maxLength: 100
                    })}
                </Grid>

                <Grid xs={12} sm={6}>
                    {renderTextField({
                        name: "postalCode",
                        label: "Postal / ZIP Code",
                        required: true,
                        maxLength: 20,
                        autoComplete: "postal-code"
                    })}
                </Grid>

                {/* COUNTRY DROPDOWN */}

                <Grid xs={12} sm={6}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        name="country"
                        label="Country"
                        value={formData.country || "India"}
                        onChange={handleChange}
                        disabled={isDisabled}
                        required
                        error={Boolean(fieldErrors.country)}
                        helperText={fieldErrors.country || " "}
                    >
                        {normalizedCountries.map((country) => (
                            <MenuItem
                                key={country.value}
                                value={country.value}
                            >
                                {country.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* ADDRESS TYPE DROPDOWN */}

                <Grid xs={12} sm={6}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        name="addressType"
                        label="Address Type"
                        value={formData.addressType || "PICKUP"}
                        onChange={handleChange}
                        disabled={isDisabled}
                        required
                        error={Boolean(fieldErrors.addressType)}
                        helperText={
                            fieldErrors.addressType ||
                            "Select the address type"
                        }
                    >
                        {normalizedAddressTypes.map((option) => (
                            <MenuItem
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* ADDRESS SETTINGS */}

            <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mb: 1 }}
            >
                Address Settings
            </Typography>

            <Stack spacing={0}>
                <FormControlLabel
                    control={
                        <Checkbox
                            name="isDefault"
                            checked={Boolean(formData.isDefault)}
                            onChange={handleChange}
                            disabled={isDisabled}
                        />
                    }
                    label="Set as default pickup address"
                />

                <FormControlLabel
                    control={
                        <Checkbox
                            name="isActive"
                            checked={Boolean(formData.isActive)}
                            onChange={handleChange}
                            disabled={isDisabled}
                        />
                    }
                    label="Address is active"
                />
            </Stack>

            {/* FORM ACTIONS */}

            {showActions && !isViewMode && (
                <>
                    <Divider sx={{ my: 3 }} />

                    <Stack
                        direction={{
                            xs: "column-reverse",
                            sm: "row"
                        }}
                        spacing={1.5}
                        justifyContent="flex-end"
                    >
                        {showCancelButton && (
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={onCancel}
                                disabled={isBusy || disabled}
                            >
                                Cancel
                            </Button>
                        )}

                        <Button
                            type="button"
                            variant="outlined"
                            startIcon={<RestartAlt />}
                            onClick={handleReset}
                            disabled={isBusy || disabled}
                        >
                            Reset
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={
                                isBusy ? (
                                    <CircularProgress
                                        size={18}
                                        color="inherit"
                                    />
                                ) : (
                                    <Save />
                                )
                            }
                            disabled={isBusy || disabled}
                        >
                            {isBusy
                                ? "Saving..."
                                : submitLabel ||
                                  (isEditMode
                                      ? "Update Address"
                                      : "Create Address")}
                        </Button>
                    </Stack>
                </>
            )}

            {loading && (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 2
                    }}
                >
                    <CircularProgress size={24} />
                </Box>
            )}
        </Box>
    );
};

export default ReversePickupAddressForm;
