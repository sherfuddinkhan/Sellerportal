import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
    Alert,
    Box,
    Breadcrumbs,
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    FormControlLabel,
    Grid,
    Link,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";

import {
    ArrowBack,
    Save,
    Cancel
} from "@mui/icons-material";

const API_URL = "http://localhost:5000/api/vendor-item-custom-fields";

const initialFormData = {
    vendorItemMasterId: "",
    name: "",
    value: "",
    sellerId: "",
    customerId: "",
    fieldName: "",
    fieldValue: "",
    supplierId: "",
    createdDate: "",
    isActive: true
};

// Read camelCase or PascalCase property names.
const getField = (object, camelCase, pascalCase) => {
    if (!object || typeof object !== "object") return undefined;

    return object[camelCase] ?? object[pascalCase];
};

// Handle common API response wrappers.
const unwrapRecord = (responseData) => {
    let result = responseData;

    for (let i = 0; i < 3; i++) {
        if (!result || typeof result !== "object") break;

        if (Array.isArray(result)) {
            result = result[0];
            continue;
        }

        const nested =
            result.data ??
            result.result ??
            result.item;

        if (nested === undefined || nested === result) break;

        result = nested;
    }

    return result;
};

const VendorItemCustomFieldEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState({});

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const showNotification = (message, severity = "success") => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    const handleBack = () => {
        navigate("/vendor-item-custom-fields");
    };

    // Load the selected record.
    useEffect(() => {
        let cancelled = false;

        const fetchRecord = async () => {
            if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
                setError("A valid custom field ID is required.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    `${API_URL}/${encodeURIComponent(id)}`
                );

                console.log("CUSTOM FIELD GET RESPONSE:", response.data);

                const record = unwrapRecord(response.data);

                if (!record || typeof record !== "object") {
                    throw new Error(
                        "The API returned no custom field record."
                    );
                }

                const name =
                    getField(record, "name", "Name") ?? "";

                const value =
                    getField(record, "value", "Value") ?? "";

                if (!cancelled) {
                    setFormData({
                        vendorItemMasterId: String(
                            getField(
                                record,
                                "vendorItemMasterId",
                                "VendorItemMasterId"
                            ) ?? ""
                        ),

                        name: String(name),
                        value: String(value),

                        sellerId: String(
                            getField(record, "sellerId", "SellerId") ?? ""
                        ),

                        customerId: String(
                            getField(record, "customerId", "CustomerId") ?? ""
                        ),

                        // These fallbacks display the database values
                        // when the API does not return separate fields.
                        fieldName: String(
                            getField(record, "fieldName", "FieldName") ??
                            name
                        ),

                        fieldValue: String(
                            getField(record, "fieldValue", "FieldValue") ??
                            value
                        ),

                        supplierId: String(
                            getField(record, "supplierId", "SupplierId") ?? ""
                        ),

                        createdDate: String(
                            getField(record, "createdDate", "CreatedDate") ??
                            ""
                        ),

                        isActive:
                            getField(record, "isActive", "IsActive") !== false
                    });
                }
            } catch (err) {
                console.error(
                    "LOAD CUSTOM FIELD ERROR:",
                    err.response?.data || err.message
                );

                if (!cancelled) {
                    setError(
                        err.response?.status === 404
                            ? "Custom field not found. Verify the GET-by-ID API."
                            : err.response?.data?.message ||
                              err.response?.data?.title ||
                              err.message ||
                              "Unable to load the custom field."
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchRecord();

        return () => {
            cancelled = true;
        };
    }, [id]);

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
    };

    const validateForm = () => {
        const validationErrors = {};

        if (!String(formData.name).trim()) {
            validationErrors.name = "Name is required.";
        }

        if (
            !String(formData.value).trim() &&
            !String(formData.fieldValue).trim()
        ) {
            validationErrors.value =
                "Enter a value in Value or Field Value.";
        }

        const positiveIntegerFields = [
            ["vendorItemMasterId", "Vendor Item Master ID"],
            ["sellerId", "Seller ID"],
            ["customerId", "Customer ID"],
            ["supplierId", "Supplier ID"]
        ];

        positiveIntegerFields.forEach(([field, label]) => {
            const currentValue = formData[field];

            if (
                currentValue !== "" &&
                (!Number.isInteger(Number(currentValue)) ||
                    Number(currentValue) <= 0)
            ) {
                validationErrors[field] =
                    `${label} must be a positive integer.`;
            }
        });

        setErrors(validationErrors);

        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        if (!id) {
            showNotification("Cannot update without a valid ID.", "error");
            return;
        }

        setSaving(true);

        // Send properties supported by the actual backend model.
        const payload = {
            vendorItemMasterId:
                formData.vendorItemMasterId === ""
                    ? null
                    : Number(formData.vendorItemMasterId),

            name: formData.name.trim(),
            value: formData.value,

            sellerId:
                formData.sellerId === ""
                    ? null
                    : Number(formData.sellerId),

            customerId:
                formData.customerId === ""
                    ? null
                    : Number(formData.customerId)
        };

        // Include extra properties only if your API DTO supports them.
        console.log("CUSTOM FIELD UPDATE PAYLOAD:", payload);

        try {
            await axios.put(
                `${API_URL}/${encodeURIComponent(id)}`,
                payload
            );

            showNotification(
                "Custom field updated successfully.",
                "success"
            );

            navigate("/vendor-item-custom-fields", {
                state: {
                    message: "Custom field updated successfully."
                }
            });
        } catch (err) {
            console.error(
                "UPDATE CUSTOM FIELD ERROR:",
                err.response?.data || err.message
            );

            showNotification(
                err.response?.data?.message ||
                    err.response?.data?.title ||
                    err.response?.data?.detail ||
                    "Unable to update the custom field. Check the backend API.",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "50vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Stack alignItems="center" spacing={2}>
                    <CircularProgress />
                    <Typography color="text.secondary">
                        Loading custom field...
                    </Typography>
                </Stack>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                    >
                        Back to Custom Fields
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Breadcrumbs sx={{ mb: 2 }}>
                <Link
                    component="button"
                    underline="hover"
                    color="inherit"
                    onClick={handleBack}
                >
                    Vendor Item Custom Fields
                </Link>

                <Typography color="text.primary">
                    Edit Custom Field
                </Typography>
            </Breadcrumbs>

            <Paper
                variant="outlined"
                sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Box>
                        <Typography variant="h4" fontWeight={700}>
                            Edit Vendor Item Custom Field
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            Update the custom field information below.
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                        >
                            Record ID: {id}
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<ArrowBack />}
                        onClick={handleBack}
                        disabled={saving}
                    >
                        Back to List
                    </Button>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2.5}>
                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                name="vendorItemMasterId"
                                label="Vendor Item Master ID"
                                value={formData.vendorItemMasterId}
                                onChange={handleChange}
                                error={Boolean(errors.vendorItemMasterId)}
                                helperText={errors.vendorItemMasterId}
                                inputProps={{ min: 1, step: 1 }}
                                disabled={saving}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
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
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="value"
                                label="Value"
                                value={formData.value}
                                onChange={handleChange}
                                error={Boolean(errors.value)}
                                helperText={errors.value}
                                disabled={saving}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="fieldName"
                                label="Field Name"
                                value={formData.fieldName}
                                onChange={handleChange}
                                disabled={saving}
                                helperText="Display fallback: Name"
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                name="fieldValue"
                                label="Field Value"
                                value={formData.fieldValue}
                                onChange={handleChange}
                                disabled={saving}
                                helperText="Display fallback: Value"
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                name="sellerId"
                                label="Seller ID"
                                value={formData.sellerId}
                                onChange={handleChange}
                                error={Boolean(errors.sellerId)}
                                helperText={errors.sellerId}
                                inputProps={{ min: 1, step: 1 }}
                                disabled={saving}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                name="customerId"
                                label="Customer ID"
                                value={formData.customerId}
                                onChange={handleChange}
                                error={Boolean(errors.customerId)}
                                helperText={errors.customerId}
                                inputProps={{ min: 1, step: 1 }}
                                disabled={saving}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                name="supplierId"
                                label="Supplier ID"
                                value={formData.supplierId}
                                onChange={handleChange}
                                error={Boolean(errors.supplierId)}
                                helperText={errors.supplierId}
                                inputProps={{ min: 1, step: 1 }}
                                disabled={saving}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Created Date"
                                value={formData.createdDate || "N/A"}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>

                        <Grid xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        disabled={saving}
                                    />
                                }
                                label="Active"
                            />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="flex-end"
                        spacing={1.5}
                    >
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<Cancel />}
                            onClick={handleBack}
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
                            disabled={saving}
                        >
                            {saving ? "Updating..." : "Update Custom Field"}
                        </Button>
                    </Stack>
                </Box>
            </Paper>

            <Snackbar
                open={notification.open}
                autoHideDuration={5000}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right"
                }}
                onClose={() =>
                    setNotification((previous) => ({
                        ...previous,
                        open: false
                    }))
                }
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

export default VendorItemCustomFieldEdit;
