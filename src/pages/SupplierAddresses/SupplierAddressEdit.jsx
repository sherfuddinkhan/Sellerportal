import React, {
    useEffect,
    useState
} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    TextField,
    MenuItem,
    CircularProgress,
    Alert,
    Box,
    Typography,
    Divider,
    FormControlLabel,
    Switch
} from "@mui/material";

import {
    EditLocationAlt,
    Close,
    Save
} from "@mui/icons-material";

/* =========================================================
   GET FIELD VALUE
========================================================= */

const getFieldValue = (data, ...fields) => {
    for (const field of fields) {
        if (
            data?.[field] !== undefined &&
            data?.[field] !== null
        ) {
            return data[field];
        }
    }

    return "";
};

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
    email: "",
    website: "",
    gstNumber: "",
    isActive: true
};

/* =========================================================
   SUPPLIER ADDRESS EDIT
========================================================= */

const SupplierAddressEdit = ({
    open,
    onClose,
    onSubmit,
    selectedSupplierAddress,
    loading = false,
    suppliers = []
}) => {

    /* =====================================================
       STATE
    ===================================================== */

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");

    /* =====================================================
       POPULATE FORM
    ===================================================== */

    useEffect(() => {
        if (open && selectedSupplierAddress) {
            setFormData({
                supplierId: String(
                    getFieldValue(
                        selectedSupplierAddress,
                        "supplierId",
                        "SupplierId"
                    )
                ),
                addressType: getFieldValue(
                    selectedSupplierAddress,
                    "addressType",
                    "AddressType"
                ) || "Billing",
                addressLine1: getFieldValue(
                    selectedSupplierAddress,
                    "addressLine1",
                    "AddressLine1",
                    "address",
                    "Address"
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
                    "PhoneNumber",
                    "contactPhone",
                    "ContactPhone"
                ),
                email: getFieldValue(
                    selectedSupplierAddress,
                    "email",
                    "Email",
                    "contactEmail",
                    "ContactEmail"
                ),
                website: getFieldValue(
                    selectedSupplierAddress,
                    "website",
                    "Website"
                ),
                gstNumber: getFieldValue(
                    selectedSupplierAddress,
                    "gstNumber",
                    "GSTNumber",
                    "gstin",
                    "GSTIN"
                ),
                isActive: (() => {
                    const status = getFieldValue(
                        selectedSupplierAddress,
                        "isActive",
                        "IsActive",
                        "status",
                        "Status"
                    );

                    if (typeof status === "boolean") {
                        return status;
                    }

                    if (typeof status === "string") {
                        return status.toLowerCase() === "active" ||
                            status.toLowerCase() === "true";
                    }

                    return Number(status) === 1;
                })()
            });

            setErrors({});
            setSubmitError("");
        }
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

        setSubmitError("");
    };

    /* =====================================================
       HANDLE STATUS CHANGE
    ===================================================== */

    const handleStatusChange = (event) => {
        setFormData((previous) => ({
            ...previous,
            isActive: event.target.checked
        }));
    };

    /* =====================================================
       VALIDATION
    ===================================================== */

    const validateForm = () => {
        const newErrors = {};

        if (!formData.supplierId) {
            newErrors.supplierId = "Please select a supplier.";
        }

        if (!formData.addressType.trim()) {
            newErrors.addressType = "Address type is required.";
        }

        if (!formData.addressLine1.trim()) {
            newErrors.addressLine1 = "Address line 1 is required.";
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required.";
        }

        if (!formData.state.trim()) {
            newErrors.state = "State is required.";
        }

        if (!formData.postalCode.trim()) {
            newErrors.postalCode = "Postal code is required.";
        }

        if (!formData.country.trim()) {
            newErrors.country = "Country is required.";
        }

        if (
            formData.email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = "Enter a valid email address.";
        }

        if (
            formData.phoneNumber &&
            !/^[+\d()\-\s]{7,20}$/.test(formData.phoneNumber)
        ) {
            newErrors.phoneNumber = "Enter a valid phone number.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    /* =====================================================
       HANDLE SUBMIT
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitError("");

        try {
            const payload = {
                supplierId: Number(formData.supplierId),
                addressType: formData.addressType.trim(),
                addressLine1: formData.addressLine1.trim(),
                addressLine2: formData.addressLine2.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                postalCode: formData.postalCode.trim(),
                country: formData.country.trim(),
                contactPerson: formData.contactPerson.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                email: formData.email.trim(),
                website: formData.website.trim(),
                gstNumber: formData.gstNumber.trim(),
                isActive: formData.isActive
            };

            await onSubmit(payload);
        } catch (error) {
            console.error(
                "UPDATE SUPPLIER ADDRESS ERROR:",
                error
            );

            setSubmitError(
                error?.response?.data?.message ||
                error?.response?.data?.title ||
                error?.message ||
                "Failed to update supplier address."
            );
        }
    };

    /* =====================================================
       CLOSE DIALOG
    ===================================================== */

    const handleClose = () => {
        if (loading) {
            return;
        }

        setErrors({});
        setSubmitError("");
        onClose?.();
    };

    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="md"
            scroll="paper"
        >
            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
            >
                {/* DIALOG HEADER */}

                <DialogTitle>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1
                        }}
                    >
                        <EditLocationAlt color="primary" />

                        <Box>
                            <Typography
                                variant="h6"
                                fontWeight={600}
                            >
                                Edit Supplier Address
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Update supplier address details
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>

                <Divider />

                {/* DIALOG CONTENT */}

                <DialogContent sx={{ pt: 3 }}>
                    {submitError && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2 }}
                        >
                            {submitError}
                        </Alert>
                    )}

                    <Grid container spacing={2.5}>

                        {/* SUPPLIER */}

                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                required
                                label="Supplier"
                                name="supplierId"
                                value={formData.supplierId}
                                onChange={handleChange}
                                error={Boolean(errors.supplierId)}
                                helperText={errors.supplierId}
                                disabled={loading}
                            >
                                <MenuItem value="">
                                    Select Supplier
                                </MenuItem>

                                {suppliers.map((supplier, index) => {
                                    const id = getFieldValue(
                                        supplier,
                                        "supplierId",
                                        "SupplierId",
                                        "id",
                                        "Id"
                                    );

                                    const name = getFieldValue(
                                        supplier,
                                        "supplierName",
                                        "SupplierName",
                                        "name",
                                        "Name"
                                    );

                                    return (
                                        <MenuItem
                                            key={id || index}
                                            value={String(id)}
                                        >
                                            {name || `Supplier ${id}`}
                                        </MenuItem>
                                    );
                                })}
                            </TextField>
                        </Grid>

                        {/* ADDRESS TYPE */}

                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                required
                                label="Address Type"
                                name="addressType"
                                value={formData.addressType}
                                onChange={handleChange}
                                error={Boolean(errors.addressType)}
                                helperText={errors.addressType}
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

                                <MenuItem value="Registered">
                                    Registered
                                </MenuItem>
                            </TextField>
                        </Grid>

                        {/* ADDRESS LINE 1 */}

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Address Line 1"
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleChange}
                                error={Boolean(errors.addressLine1)}
                                helperText={errors.addressLine1}
                                disabled={loading}
                            />
                        </Grid>

                        {/* ADDRESS LINE 2 */}

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address Line 2"
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Grid>

                        {/* CITY */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                error={Boolean(errors.city)}
                                helperText={errors.city}
                                disabled={loading}
                            />
                        </Grid>

                        {/* STATE */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                error={Boolean(errors.state)}
                                helperText={errors.state}
                                disabled={loading}
                            />
                        </Grid>

                        {/* POSTAL CODE */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Postal Code"
                                name="postalCode"
                                value={formData.postalCode}
                                onChange={handleChange}
                                error={Boolean(errors.postalCode)}
                                helperText={errors.postalCode}
                                disabled={loading}
                            />
                        </Grid>

                        {/* COUNTRY */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                error={Boolean(errors.country)}
                                helperText={errors.country}
                                disabled={loading}
                            />
                        </Grid>

                        {/* CONTACT SECTION */}

                        <Grid item xs={12}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                            >
                                Contact Information
                            </Typography>

                            <Divider sx={{ mt: 1 }} />
                        </Grid>

                        {/* CONTACT PERSON */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Contact Person"
                                name="contactPerson"
                                value={formData.contactPerson}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Grid>

                        {/* PHONE */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                error={Boolean(errors.phoneNumber)}
                                helperText={errors.phoneNumber}
                                disabled={loading}
                            />
                        </Grid>

                        {/* EMAIL */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="email"
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={Boolean(errors.email)}
                                helperText={errors.email}
                                disabled={loading}
                            />
                        </Grid>

                        {/* WEBSITE */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Website"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Grid>

                        {/* GST NUMBER */}

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="GST Number"
                                name="gstNumber"
                                value={formData.gstNumber}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </Grid>

                        {/* STATUS */}

                        <Grid item xs={12} sm={6}>
                            <Box
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    pl: 1
                                }}
                            >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={formData.isActive}
                                            onChange={handleStatusChange}
                                            disabled={loading}
                                        />
                                    }
                                    label={
                                        formData.isActive
                                            ? "Active"
                                            : "Inactive"
                                    }
                                />
                            </Box>
                        </Grid>

                    </Grid>
                </DialogContent>

                <Divider />

                {/* DIALOG ACTIONS */}

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<Close />}
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
                        {loading ? "Saving..." : "Update Address"}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default SupplierAddressEdit;

