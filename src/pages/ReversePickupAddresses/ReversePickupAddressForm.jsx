import React, {
    useEffect,
    useState
} from "react";

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

/* =========================================================
   INITIAL FORM VALUES
========================================================= */

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

    addressType: "Home",

    isDefault: false,
    isActive: true
};

/* =========================================================
   FIELD ALIASES
========================================================= */

const getFieldValue = (source, aliases, fallback = "") => {
    for (const key of aliases) {
        const value = source?.[key];

        if (value !== undefined && value !== null) {
            return value;
        }
    }

    return fallback;
};

/* =========================================================
   MAP ADDRESS DATA
========================================================= */

const mapAddressToForm = (address = {}) => ({
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
        [
            "addressLine1",
            "AddressLine1",
            "address1",
            "Address1"
        ]
    ),

    addressLine2: getFieldValue(
        address,
        [
            "addressLine2",
            "AddressLine2",
            "address2",
            "Address2"
        ]
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
            "PinCode"
        ]
    ),

    country: getFieldValue(
        address,
        ["country", "Country"],
        "India"
    ),

    addressType: getFieldValue(
        address,
        ["addressType", "AddressType"],
        "Home"
    ),

    isDefault: Boolean(
        getFieldValue(
            address,
            ["isDefault", "IsDefault", "defaultAddress", "DefaultAddress"],
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
});

/* =========================================================
   REVERSE PICKUP ADDRESS FORM
========================================================= */

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

    addressTypes = [
        "Home",
        "Office",
        "Warehouse",
        "Other"
    ],

    countries = [
        "India",
        "United States",
        "United Kingdom",
        "Canada",
        "Australia",
        "Other"
    ]
}) => {

    /* =====================================================
       MODE
    ===================================================== */

    const normalizedMode = String(mode || "create")
        .trim()
        .toLowerCase();

    const isEditMode = [
        "edit",
        "update"
    ].includes(normalizedMode);

    const isViewMode = [
        "view",
        "details",
        "read"
    ].includes(normalizedMode);

    const isBusy = Boolean(loading || submitting);

    const isDisabled = disabled || isBusy || isViewMode;

    /* =====================================================
       FORM STATE
    ===================================================== */

    const [formData, setFormData] = useState(() => ({
        ...initialFormData,
        ...mapAddressToForm(initialValues || address || {})
    }));

    const [fieldErrors, setFieldErrors] = useState({});

    /* =====================================================
       RESET FORM WHEN ADDRESS CHANGES
    ===================================================== */

    useEffect(() => {
        const source = initialValues || address || {};

        setFormData({
            ...initialFormData,
            ...mapAddressToForm(source)
        });

        setFieldErrors({});
    }, [address, initialValues, mode]);

    /* =====================================================
       HANDLE FIELD CHANGE
    ===================================================== */

    const handleChange = (event) => {
        const {
            name,
            value,
            type,
            checked
        } = event.target;

        const nextValue = type === "checkbox"
            ? checked
            : value;

        setFormData((previous) => ({
            ...previous,
            [name]: nextValue
        }));

        setFieldErrors((previous) => ({
            ...previous,
            [name]: ""
        }));
    };

    /* =====================================================
       VALIDATION
    ===================================================== */

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
                errors.phoneNumber =
                    "Enter a valid phone number.";
            }
        }

        if (
            formData.alternatePhoneNumber &&
            String(formData.alternatePhoneNumber).trim()
        ) {
            const digits = String(formData.alternatePhoneNumber)
                .replace(/\D/g, "");

            if (digits.length < 7 || digits.length > 15) {
                errors.alternatePhoneNumber =
                    "Enter a valid alternate phone number.";
            }
        }

        if (
            formData.email &&
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
        } else if (
            String(formData.postalCode).trim().length > 20
        ) {
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

    /* =====================================================
       SUBMIT FORM
    ===================================================== */

    const handleSubmit = (event) => {
        event.preventDefault();

        if (isBusy || disabled || isViewMode) {
            return;
        }

        if (!validateForm()) {
            return;
        }

        if (typeof onSubmit === "function") {
            onSubmit({
                ...formData,
                contactName: formData.contactName.trim(),
                contactPerson: formData.contactPerson.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                alternatePhoneNumber:
                    formData.alternatePhoneNumber.trim(),
                email: formData.email.trim(),
                addressLine1: formData.addressLine1.trim(),
                addressLine2: formData.addressLine2.trim(),
                landmark: formData.landmark.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                postalCode: formData.postalCode.trim(),
                country: formData.country.trim(),
                addressType: formData.addressType.trim()
            });
        }
    };

    /* =====================================================
       RESET FORM
    ===================================================== */

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

    /* =====================================================
       TEXT FIELD HELPER
    ===================================================== */

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
                maxLength
                    ? { maxLength }
                    : undefined
            }
            size="small"
        />
    );

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Box
            component="form"
            id={formId}
            onSubmit={handleSubmit}
            noValidate
            sx={{ width: "100%" }}
        >
            {/* =================================================
                ALERTS
            ================================================= */}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}

            {success && (
                <Alert
                    severity="success"
                    sx={{ mb: 2 }}
                >
                    {success}
                </Alert>
            )}

            {/* =================================================
                CONTACT INFORMATION
            ================================================= */}

            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ mb: 2 }}
            >
                <LocationOn color="primary" />

                <Typography
                    variant="subtitle1"
                    fontWeight={700}
                >
                    Contact Information
                </Typography>
            </Stack>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "contactName",
                        label: "Contact Name",
                        required: true,
                        maxLength: 150,
                        autoComplete: "name"
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "contactPerson",
                        label: "Contact Person",
                        maxLength: 150
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "phoneNumber",
                        label: "Phone Number",
                        required: true,
                        maxLength: 20,
                        autoComplete: "tel"
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "alternatePhoneNumber",
                        label: "Alternate Phone Number",
                        maxLength: 20
                    })}
                </Grid>

                <Grid item xs={12}>
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

            {/* =================================================
                ADDRESS INFORMATION
            ================================================= */}

            <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ mb: 2 }}
            >
                Address Information
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {renderTextField({
                        name: "addressLine1",
                        label: "Address Line 1",
                        required: true,
                        maxLength: 250,
                        placeholder: "Building, street, or house number"
                    })}
                </Grid>

                <Grid item xs={12}>
                    {renderTextField({
                        name: "addressLine2",
                        label: "Address Line 2",
                        maxLength: 250,
                        placeholder: "Area, locality, or additional details"
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "landmark",
                        label: "Landmark",
                        maxLength: 150
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "city",
                        label: "City",
                        required: true,
                        maxLength: 100
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "state",
                        label: "State / Province",
                        required: true,
                        maxLength: 100
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    {renderTextField({
                        name: "postalCode",
                        label: "Postal / ZIP Code",
                        required: true,
                        maxLength: 20,
                        autoComplete: "postal-code"
                    })}
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        select
                        fullWidth
                        size="small"
                        name="country"
                        label="Country"
                        value={formData.country}
                        onChange={handleChange}
                        disabled={isDisabled}
                        error={Boolean(fieldErrors.country)}
                        helperText={fieldErrors.country || " "}
                    >
                        {countries.map((country) => (
                            <MenuItem
                                key={country}
                                value={country}
                            >
                                {country}
                            </MenuItem>
                        ))}
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
                        disabled={isDisabled}
                        required
                        error={Boolean(fieldErrors.addressType)}
                        helperText={fieldErrors.addressType || " "}
                    >
                        {addressTypes.map((type) => (
                            <MenuItem
                                key={type}
                                value={type}
                            >
                                {type}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* =================================================
                ADDRESS SETTINGS
            ================================================= */}

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

            {/* =================================================
                FORM ACTIONS
            ================================================= */}

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

