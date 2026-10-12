import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Breadcrumbs,
    Button,
    CircularProgress,
    Divider,
    FormControl,
    Grid,
    InputLabel,
    Link,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Edit,
    Person,
    Save
} from "@mui/icons-material";

// =========================================================
// API CONFIGURATION - NODE.JS AXIOS PROXY
// =========================================================

const SUPPLIER_CONTACT_API =
    "http://localhost:5000/api/supplier-contacts";

const SUPPLIER_API =
    "http://localhost:5000/api/Supplier";

// =========================================================
// INITIAL FORM DATA - MATCHES THE API MODEL
// =========================================================

const initialFormData = {
    supplierId: "",
    contactType: "PRIMARY",
    name: "",
    contactName: "",
    email: "",
    phone: "",
    sellerId: "6",
    customerId: "3"
};

// =========================================================
// NORMALIZE API LIST RESPONSE
// =========================================================

const normalizeList = (response) => {
    const data = response?.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.$values)) return data.$values;

    return [];
};

// =========================================================
// SAFE FIELD ACCESS
// =========================================================

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

// =========================================================
// CONTACT ID
// =========================================================

const getContactId = (contact) =>
    getField(
        contact,
        "partyContactId",
        "PartyContactId",
        "supplierContactId",
        "SupplierContactId"
    );

// =========================================================
// SUPPLIER HELPERS
// =========================================================

const getSupplierId = (supplier) =>
    getField(
        supplier,
        "supplierId",
        "SupplierId",
        "id",
        "Id"
    );

const getSupplierName = (supplier) =>
    getField(
        supplier,
        "supplierName",
        "SupplierName",
        "name",
        "Name"
    ) || "Unnamed Supplier";

// =========================================================
// MAP API RESPONSE TO FORM
// =========================================================

const mapContactToForm = (contact) => ({
    supplierId: String(
        getField(contact, "supplierId", "SupplierId") || ""
    ),

    contactType: String(
        getField(contact, "contactType", "ContactType") ||
        "PRIMARY"
    ).toUpperCase(),

    name: String(
        getField(contact, "name", "Name") || ""
    ),

    contactName: String(
        getField(contact, "contactName", "ContactName") ||
        getField(contact, "name", "Name") ||
        ""
    ),

    email: String(
        getField(contact, "email", "Email") || ""
    ),

    phone: String(
        getField(contact, "phone", "Phone") || ""
    ),

    sellerId: String(
        getField(contact, "sellerId", "SellerId") || ""
    ),

    customerId: String(
        getField(contact, "customerId", "CustomerId") || ""
    )
});

// =========================================================
// SUPPLIER CONTACT EDIT PAGE
// =========================================================

const SupplierContactEdit = ({
    supplierContactId,
    contactId,
    supplierContact,
    onBack,
    onCancel,
    onUpdated
}) => {
    const navigate = useNavigate();
    const params = useParams();

    const requestedId =
        supplierContactId ??
        contactId ??
        params.id ??
        getContactId(supplierContact);

    const [formData, setFormData] = useState(initialFormData);
    const [suppliers, setSuppliers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingSuppliers, setLoadingSuppliers] = useState(false);
    const [saving, setSaving] = useState(false);

    const [errors, setErrors] = useState({});
    const [pageError, setPageError] = useState("");

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    // =====================================================
    // NOTIFICATION
    // =====================================================

    const showNotification = (message, severity = "success") => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    // =====================================================
    // FETCH CONTACT DETAILS
    // =====================================================

    const fetchSupplierContact = useCallback(async () => {
        if (
            requestedId === undefined ||
            requestedId === null ||
            requestedId === "" ||
            Number(requestedId) <= 0
        ) {
            if (supplierContact) {
                setFormData(mapContactToForm(supplierContact));
                setLoading(false);
                return;
            }

            setPageError("Supplier contact ID is missing or invalid.");
            setLoading(false);
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
                throw new Error("Supplier contact was not found.");
            }

            setFormData(mapContactToForm(data));
        } catch (error) {
            console.error("GET SUPPLIER CONTACT ERROR:", error);

            setPageError(
                error?.response?.data?.message ||
                error?.response?.data?.title ||
                error?.response?.data?.detail ||
                error?.message ||
                "Failed to load supplier contact."
            );
        } finally {
            setLoading(false);
        }
    }, [requestedId, supplierContact]);

    // =====================================================
    // FETCH SUPPLIERS
    // =====================================================

    const fetchSuppliers = useCallback(async () => {
        setLoadingSuppliers(true);

        try {
            const response = await axios.get(SUPPLIER_API);
            setSuppliers(normalizeList(response));
        } catch (error) {
            console.error("GET SUPPLIERS ERROR:", error);

            showNotification(
                "Failed to load suppliers. Check the Supplier API route.",
                "error"
            );
        } finally {
            setLoadingSuppliers(false);
        }
    }, []);

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        fetchSupplierContact();
        fetchSuppliers();
    }, [fetchSupplierContact, fetchSuppliers]);

    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => {
            const updated = {
                ...previous,
                [name]: value
            };

            // Keep both API name fields synchronized.
            if (name === "name") {
                updated.contactName = value;
            } else if (name === "contactName") {
                updated.name = value;
            }

            return updated;
        });

        setErrors((previous) => ({
            ...previous,
            [name]: "",
            ...(name === "name" ? { contactName: "" } : {}),
            ...(name === "contactName" ? { name: "" } : {})
        }));

        setPageError("");
    };

    // =====================================================
    // NAVIGATION
    // =====================================================

    const handleBack = () => {
        if (saving) return;

        if (onBack) {
            onBack();
        } else if (onCancel) {
            onCancel();
        } else {
            navigate("/supplier-contacts");
        }
    };

    // =====================================================
    // VALIDATION
    // =====================================================

    const validateForm = () => {
        const newErrors = {};

        if (!formData.supplierId) {
            newErrors.supplierId = "Please select a supplier.";
        }

        if (!formData.contactType) {
            newErrors.contactType = "Please select a contact type.";
        }

        if (!formData.name.trim()) {
            newErrors.name = "Name is required.";
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

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required.";
        }

        if (
            !formData.sellerId ||
            Number(formData.sellerId) <= 0
        ) {
            newErrors.sellerId = "Enter a valid Seller ID.";
        }

        if (
            !formData.customerId ||
            Number(formData.customerId) <= 0
        ) {
            newErrors.customerId = "Enter a valid Customer ID.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // =====================================================
    // UPDATE CONTACT
    // =====================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        if (
            !requestedId ||
            Number(requestedId) <= 0
        ) {
            setPageError("Supplier contact ID is missing or invalid.");
            return;
        }

        const payload = {
            partyContactId: Number(requestedId),
            supplierId: Number(formData.supplierId),
            contactType: formData.contactType,
            name: formData.name.trim(),
            contactName: formData.contactName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            sellerId: Number(formData.sellerId),
            customerId: Number(formData.customerId)
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
                await onUpdated(response.data, payload);
            } else {
                navigate("/supplier-contacts", {
                    state: {
                        message: "Supplier contact updated successfully.",
                        severity: "success"
                    }
                });
            }
        } catch (error) {
            console.error("UPDATE SUPPLIER CONTACT ERROR:", error);

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.title ||
                error?.response?.data?.detail ||
                error?.message ||
                "Failed to update supplier contact.";

            setPageError(message);
            showNotification(message, "error");
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

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

    // =====================================================
    // PAGE UI
    // =====================================================

    return (
        <Box sx={{ width: "100%", p: { xs: 1, md: 3 } }}>
            <Breadcrumbs sx={{ mb: 2 }}>
                <Link
                    component="button"
                    type="button"
                    underline="hover"
                    color="inherit"
                    onClick={handleBack}
                    sx={{ cursor: "pointer" }}
                >
                    Supplier Contacts
                </Link>

                <Typography color="text.primary">
                    Edit Contact
                </Typography>
            </Breadcrumbs>

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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Edit color="primary" fontSize="large" />

                    <Box>
                        <Typography variant="h5" fontWeight={600}>
                            Edit Supplier Contact
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                            Update supplier contact information.
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

            {pageError && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                    onClose={() => setPageError("")}
                >
                    {pageError}
                </Alert>
            )}

            <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 2
                        }}
                    >
                        <Person color="primary" />

                        <Typography variant="h6" fontWeight={600}>
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
                            <Grid item xs={12} md={6}>
                                <FormControl
                                    fullWidth
                                    required
                                    error={Boolean(errors.supplierId)}
                                    disabled={saving || loadingSuppliers}
                                >
                                    <InputLabel id="edit-supplier-label">
                                        Supplier
                                    </InputLabel>

                                    <Select
                                        labelId="edit-supplier-label"
                                        name="supplierId"
                                        value={formData.supplierId}
                                        label="Supplier"
                                        onChange={handleChange}
                                    >
                                        {suppliers.map((supplier, index) => {
                                            const id = getSupplierId(supplier);

                                            if (id === "") return null;

                                            return (
                                                <MenuItem
                                                    key={id || index}
                                                    value={String(id)}
                                                >
                                                    {getSupplierName(supplier)}
                                                </MenuItem>
                                            );
                                        })}

                                        {formData.supplierId &&
                                            !suppliers.some(
                                                (supplier) =>
                                                    String(getSupplierId(supplier)) ===
                                                    String(formData.supplierId)
                                            ) && (
                                                <MenuItem value={formData.supplierId}>
                                                    Current supplier (ID: {formData.supplierId})
                                                </MenuItem>
                                            )}
                                    </Select>

                                    {errors.supplierId && (
                                        <Typography variant="caption" color="error">
                                            {errors.supplierId}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* CONTACT TYPE */}
                            <Grid item xs={12} md={6}>
                                <FormControl
                                    fullWidth
                                    required
                                    error={Boolean(errors.contactType)}
                                    disabled={saving}
                                >
                                    <InputLabel id="edit-contact-type-label">
                                        Contact Type
                                    </InputLabel>

                                    <Select
                                        labelId="edit-contact-type-label"
                                        name="contactType"
                                        value={formData.contactType}
                                        label="Contact Type"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="PRIMARY">Primary</MenuItem>
                                        <MenuItem value="SECONDARY">Secondary</MenuItem>
                                        <MenuItem value="BILLING">Billing</MenuItem>
                                        <MenuItem value="SHIPPING">Shipping</MenuItem>
                                        <MenuItem value="OTHER">Other</MenuItem>
                                    </Select>

                                    {errors.contactType && (
                                        <Typography variant="caption" color="error">
                                            {errors.contactType}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* NAME */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    name="name"
                                    label="Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={Boolean(errors.name)}
                                    helperText={errors.name}
                                    disabled={saving}
                                    inputProps={{ maxLength: 150 }}
                                />
                            </Grid>

                            {/* CONTACT NAME */}
                            <Grid item xs={12} md={6}>
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

                            {/* EMAIL */}
                            <Grid item xs={12} md={6}>
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
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    name="phone"
                                    label="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    error={Boolean(errors.phone)}
                                    helperText={errors.phone}
                                    disabled={saving}
                                    inputProps={{ maxLength: 30 }}
                                />
                            </Grid>

                            {/* SELLER ID */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    name="sellerId"
                                    label="Seller ID"
                                    value={formData.sellerId}
                                    onChange={handleChange}
                                    error={Boolean(errors.sellerId)}
                                    helperText={errors.sellerId}
                                    disabled={saving}
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>

                            {/* CUSTOMER ID */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    name="customerId"
                                    label="Customer ID"
                                    value={formData.customerId}
                                    onChange={handleChange}
                                    error={Boolean(errors.customerId)}
                                    helperText={errors.customerId}
                                    disabled={saving}
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>
                        </Grid>

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
                                    saving
                                        ? <CircularProgress size={18} color="inherit" />
                                        : <Save />
                                }
                                disabled={saving || loadingSuppliers}
                            >
                                {saving ? "Updating..." : "Update Contact"}
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>

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
