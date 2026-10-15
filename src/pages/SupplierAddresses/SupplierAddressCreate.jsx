
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    Card,
    CardContent,
    Container
} from "@mui/material";

import {
    AddLocationAlt,
    Close,
    Save
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api";

// ============================================================
// Helpers
// ============================================================
const getFieldValue = (data, ...fields) => {
    for (const field of fields) {
        const value = data?.[field];

        if (
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
        ) {
            return value;
        }
    }

    return "";
};

const extractArray = (body) => {
    if (Array.isArray(body)) return body;
    if (!body || typeof body !== "object") return [];

    const candidates = [
        body.data,
        body.items,
        body.suppliers,
        body.results,
        body.result,
        body.$values,
        body.data?.data,
        body.data?.items,
        body.data?.suppliers,
        body.data?.$values,
        body.result?.items,
        body.result?.$values
    ];

    return candidates.find(Array.isArray) || [];
};

// ============================================================
// Initial Form
// ============================================================
const initialFormData = {
    supplierId: "",
    addressType: "Billing",
    addressLine1: "",
    addressLine2: "",
    countryCode: "IN",
    stateCode: "TG",
    city: "",
    pincode: "",
    phone: "",
    latitude: "",
    longitude: "",
    sellerId: "",
    customerId: ""
};

// ============================================================
// Component
// ============================================================
const SupplierAddressCreate = ({
    open,
    onClose,
    onSubmit
}) => {
    const navigate = useNavigate();

    const isDialogMode = typeof open === "boolean";
    const isOpen = isDialogMode ? open : true;

    // Form
    const [formData, setFormData] = useState({
        ...initialFormData
    });
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Suppliers
    const [suppliers, setSuppliers] = useState([]);
    const [supplierLoading, setSupplierLoading] = useState(false);
    const [supplierError, setSupplierError] = useState("");

    // ========================================================
    // Load Suppliers
    // ========================================================
    useEffect(() => {
        let cancelled = false;

        const fetchSuppliers = async () => {
            try {
                setSupplierLoading(true);
                setSupplierError("");

                const response = await axios.get(
                    `${API_URL}/Supplier`
                );

                console.log(
                    "SUPPLIER API STATUS:",
                    response.status
                );
                console.log(
                    "SUPPLIER API RESPONSE:",
                    response.data
                );

                const supplierData = extractArray(response.data);

                console.log(
                    "EXTRACTED SUPPLIERS:",
                    supplierData
                );

                if (cancelled) return;

                setSuppliers(supplierData);

                if (supplierData.length === 0) {
                    setSupplierError(
                        "No suppliers found in the API response."
                    );
                }
            } catch (error) {
                console.error("SUPPLIER API ERROR:", error);
                console.error(
                    "SUPPLIER API ERROR RESPONSE:",
                    error.response?.data
                );

                if (!cancelled) {
                    setSupplierError(
                        error.response?.data?.message ||
                        error.response?.data?.title ||
                        error.message ||
                        "Unable to load suppliers."
                    );
                }
            } finally {
                if (!cancelled) {
                    setSupplierLoading(false);
                }
            }
        };

        fetchSuppliers();

        return () => {
            cancelled = true;
        };
    }, []);

    // ========================================================
    // Reset Form
    // ========================================================
    useEffect(() => {
        if (isOpen) {
            setFormData({ ...initialFormData });
            setErrors({});
            setSubmitError("");
            setSuccessMessage("");
        }
    }, [isOpen]);

    // ========================================================
    // Handle Input
    // ========================================================
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
        setSuccessMessage("");
    };

    // ========================================================
    // Validation
    // ========================================================
    const validateForm = () => {
        const newErrors = {};

        if (!formData.supplierId) {
            newErrors.supplierId = "Please select a supplier.";
        }

        if (!formData.addressLine1.trim()) {
            newErrors.addressLine1 =
                "Address line 1 is required.";
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required.";
        }

        if (!formData.countryCode.trim()) {
            newErrors.countryCode =
                "Country code is required.";
        }

        if (!formData.stateCode.trim()) {
            newErrors.stateCode = "State code is required.";
        }

        if (!formData.pincode.trim()) {
            newErrors.pincode = "Pincode is required.";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // ========================================================
    // Close
    // ========================================================
    const handleClose = () => {
        if (loading) return;

        if (isDialogMode) {
            onClose?.();
        } else {
            navigate("/supplier-addresses");
        }
    };

    // ========================================================
    // Submit
    // ========================================================
    const handleSubmit = async (event) => {
        event.preventDefault();

        setSubmitError("");
        setSuccessMessage("");

        if (!validateForm()) return;

        const payload = {
            supplierId: Number(formData.supplierId),
            addressType: formData.addressType.trim(),
            addressLine1: formData.addressLine1.trim(),
            addressLine2: formData.addressLine2.trim(),
            countryCode: formData.countryCode.trim(),
            stateCode: formData.stateCode.trim(),
            city: formData.city.trim(),
            pincode: formData.pincode.trim(),
            phone: formData.phone.trim(),
            latitude: formData.latitude.trim()
                ? Number(formData.latitude)
                : 17.4485,
            longitude: formData.longitude.trim()
                ? Number(formData.longitude)
                : 78.3908,
            sellerId: Number(formData.sellerId) || 0,
            customerId: Number(formData.customerId) || 0,
            createdDate: new Date().toISOString()
        };

        try {
            setLoading(true);

            console.log(
                "SUPPLIER ADDRESS REQUEST PAYLOAD:",
                payload
            );

            if (typeof onSubmit === "function") {
                // Parent handles the request.
                await onSubmit(payload);
            } else {
                // Standalone page uses the Node.js proxy.
                const response = await axios.post(
                    `${API_URL}/SupplierAddress`,
                    payload
                );

                console.log(
                    "SUPPLIER ADDRESS CREATED:",
                    response.data
                );
            }

            if (isDialogMode) {
                if (typeof onClose === "function") {
                    onClose();
                } else {
                    setSuccessMessage(
                        "Supplier address created successfully."
                    );
                }
            } else {
                navigate("/supplier-addresses");
            }
        } catch (error) {
            console.error(
                "CREATE SUPPLIER ADDRESS ERROR:",
                error
            );
            console.error(
                "HTTP STATUS:",
                error.response?.status
            );
            console.error(
                "BACKEND ERROR RESPONSE:",
                error.response?.data
            );

            const responseData = error.response?.data;

            setSubmitError(
                responseData?.message ||
                responseData?.title ||
                responseData?.detail ||
                (typeof responseData === "string"
                    ? responseData
                    : "") ||
                error.message ||
                "Failed to create supplier address."
            );
        } finally {
            setLoading(false);
        }
    };

    // ========================================================
    // Supplier Options
    // ========================================================
    const supplierOptions = suppliers
        .map((supplier) => {
            const id = getFieldValue(
                supplier,
                "supplierId",
                "SupplierId",
                "supplierID",
                "SupplierID",
                "id",
                "Id"
            );

            const name = getFieldValue(
                supplier,
                "supplierName",
                "SupplierName",
                "companyName",
                "CompanyName",
                "supplierCompanyName",
                "SupplierCompanyName",
                "name",
                "Name"
            );

            return {
                id,
                name: name
                    ? String(name).trim()
                    : `Supplier ${id}`
            };
        })
        .filter(
            (supplier) =>
                supplier.id !== "" &&
                supplier.id !== null &&
                supplier.id !== undefined
        );

    // ========================================================
    // Shared Form Content
    // MUI v7 Grid syntax
    // ========================================================
    const formContent = (
        <>
            {submitError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {submitError}
                </Alert>
            )}

            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {successMessage}
                </Alert>
            )}

            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        select
                        fullWidth
                        required
                        label="Supplier"
                        name="supplierId"
                        value={formData.supplierId}
                        onChange={handleChange}
                        error={Boolean(
                            errors.supplierId || supplierError
                        )}
                        helperText={
                            errors.supplierId ||
                            supplierError ||
                            (supplierLoading
                                ? "Loading suppliers..."
                                : "")
                        }
                        disabled={loading || supplierLoading}
                    >
                        <MenuItem value="">
                            {supplierLoading
                                ? "Loading suppliers..."
                                : "Select Supplier"}
                        </MenuItem>

                        {supplierOptions.map((supplier) => (
                            <MenuItem
                                key={supplier.id}
                                value={String(supplier.id)}
                            >
                                {supplier.name}
                            </MenuItem>
                        ))}

                        {!supplierLoading &&
                            supplierOptions.length === 0 && (
                                <MenuItem
                                    disabled
                                    value="__no_suppliers__"
                                >
                                    No suppliers found
                                </MenuItem>
                            )}
                    </TextField>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                        select
                        fullWidth
                        required
                        label="Address Type"
                        name="addressType"
                        value={formData.addressType}
                        onChange={handleChange}
                        disabled={loading}
                    >
                        {[
                            "Billing",
                            "Shipping",
                            "Office",
                            "Warehouse"
                        ].map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                <Grid size={{ xs: 12 }}>
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

                <Grid size={{ xs: 12 }}>
                    <TextField
                        fullWidth
                        label="Address Line 2"
                        name="addressLine2"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                        fullWidth
                        required
                        label="Country Code"
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        error={Boolean(errors.countryCode)}
                        helperText={errors.countryCode}
                        disabled={loading}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                        fullWidth
                        required
                        label="State Code"
                        name="stateCode"
                        value={formData.stateCode}
                        onChange={handleChange}
                        error={Boolean(errors.stateCode)}
                        helperText={errors.stateCode}
                        disabled={loading}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
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

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        required
                        label="Pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        error={Boolean(errors.pincode)}
                        helperText={errors.pincode}
                        disabled={loading}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        required
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={Boolean(errors.phone)}
                        helperText={errors.phone}
                        disabled={loading}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label="Latitude"
                        name="latitude"
                        placeholder="17.4485"
                        value={formData.latitude}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label="Longitude"
                        name="longitude"
                        placeholder="78.3908"
                        value={formData.longitude}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2" fontWeight={700}>
                        Seller / Customer
                    </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label="Seller ID"
                        type="number"
                        name="sellerId"
                        value={formData.sellerId}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        fullWidth
                        label="Customer ID"
                        type="number"
                        name="customerId"
                        value={formData.customerId}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </Grid>
            </Grid>
        </>
    );

    // ========================================================
    // Shared Buttons
    // ========================================================
    const actionButtons = (
        <>
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
                    loading ? (
                        <CircularProgress
                            size={18}
                            color="inherit"
                        />
                    ) : (
                        <Save />
                    )
                }
                disabled={loading || supplierLoading}
            >
                {loading ? "Creating..." : "Create Address"}
            </Button>
        </>
    );

    // ========================================================
    // Page Mode
    // ========================================================
    if (!isDialogMode) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Card>
                    <CardContent sx={{ p: 3 }}>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                mb: 2
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 46,
                                    height: 46,
                                    borderRadius: 2,
                                    bgcolor: "action.hover",
                                    color: "primary.main"
                                }}
                            >
                                <AddLocationAlt />
                            </Box>

                            <Box>
                                <Typography variant="h6" fontWeight={700}>
                                    Create Supplier Address
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Enter the supplier address details below
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                        >
                            {formContent}

                            <Box
                                sx={{
                                    mt: 3,
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: 2
                                }}
                            >
                                {actionButtons}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        );
    }

    // ========================================================
    // Dialog Mode
    // ========================================================
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
                <DialogTitle>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5
                        }}
                    >
                        <AddLocationAlt color="primary" />
                        <Box>
                            <Typography variant="h6" fontWeight={700}>
                                Create Supplier Address
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Enter the supplier address details below
                            </Typography>
                        </Box>
                    </Box>
                </DialogTitle>

                <Divider />

                <DialogContent sx={{ pt: 3 }}>
                    {formContent}
                </DialogContent>

                <Divider />

                <DialogActions sx={{ p: 2 }}>
                    {actionButtons}
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default SupplierAddressCreate;
