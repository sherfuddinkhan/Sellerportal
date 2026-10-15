import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
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
Container,
IconButton
} from "@mui/material";
import { ArrowBack, Save } from "@mui/icons-material";

const API_BASE_URL = "http://localhost:5000/api";

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

const SupplierAddressEdit = () => {
const { id } = useParams();
const navigate = useNavigate();
const isEdit = Boolean(id);
const [formData, setFormData] = useState(initialFormData);
const [suppliers, setSuppliers] = useState([]);
const [loading, setLoading] = useState(isEdit);
const [saving, setSaving] = useState(false);
const [errors, setErrors] = useState({});
const [submitError, setSubmitError] = useState("");

useEffect(() => {
    const load = async () => {
        try {
            const [supRes, addrRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/Supplier`),
                isEdit
                    ? axios.get(`${API_BASE_URL}/SupplierAddress/${id}`)
                    : Promise.resolve(null)
            ]);

            const supList = supRes.data?.data || supRes.data || [];

            setSuppliers(Array.isArray(supList) ? supList : []);

            if (isEdit && addrRes) {
                const data = addrRes.data?.data || addrRes.data;

                setFormData({
                    supplierId: String(
                        getFieldValue(data, "supplierId", "SupplierId") || ""
                    ),
                    addressType:
                        getFieldValue(data, "addressType", "AddressType") ||
                        "Billing",
                    addressLine1: getFieldValue(
                        data, "addressLine1", "AddressLine1"
                    ),
                    addressLine2: getFieldValue(
                        data, "addressLine2", "AddressLine2"
                    ),
                    countryCode:
                        getFieldValue(data, "countryCode", "CountryCode") ||
                        "IN",
                    stateCode: getFieldValue(
                        data, "stateCode", "StateCode", "state", "State"
                    ),
                    city: getFieldValue(data, "city", "City"),
                    pincode: getFieldValue(
                        data, "pincode", "Pincode",
                        "postalCode", "PostalCode"
                    ),
                    phone: getFieldValue(
                        data, "phone", "Phone",
                        "phoneNumber", "PhoneNumber"
                    ),
                    latitude: getFieldValue(
                        data, "latitude", "Latitude"
                    ),
                    longitude: getFieldValue(
                        data, "longitude", "Longitude"
                    ),
                    sellerId: String(
                        getFieldValue(data, "sellerId", "SellerId") || ""
                    ),
                    customerId: String(
                        getFieldValue(data, "customerId", "CustomerId") || ""
                    )
                });
            }
        } catch (err) {
            console.error("Failed to load supplier address:", err);
            setSubmitError(
                err.response?.data?.message || "Failed to load data."
            );
        } finally {
            setLoading(false);
        }
    };

    load();
}, [id, isEdit]);

const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
        ...prev,
        [name]: value
    }));

    setErrors((prev) => ({
        ...prev,
        [name]: ""
    }));
};

const validateForm = () => {
    const newErrors = {};

    if (!formData.supplierId) {
        newErrors.supplierId = "Supplier required";
    }

    if (!formData.addressLine1.trim()) {
        newErrors.addressLine1 = "Address Line 1 is required";
    }

    if (!formData.city.trim()) {
        newErrors.city = "City is required";
    }

    if (!formData.stateCode.trim()) {
        newErrors.stateCode = "State code required";
    }

    if (!formData.countryCode.trim()) {
        newErrors.countryCode = "Country code required";
    }

    if (!formData.pincode.trim()) {
        newErrors.pincode = "Pincode required";
    }

    if (!formData.phone.trim()) {
        newErrors.phone = "Phone required";
    }

    const latitude =
        formData.latitude === "" ? null : Number(formData.latitude);

    const longitude =
        formData.longitude === "" ? null : Number(formData.longitude);

    if (
        latitude !== null &&
        (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)
    ) {
        newErrors.latitude = "Latitude must be between -90 and 90";
    }

    if (
        longitude !== null &&
        (!Number.isFinite(longitude) ||
            longitude < -180 ||
            longitude > 180)
    ) {
        newErrors.longitude = "Longitude must be between -180 and 180";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    setSaving(true);
    setSubmitError("");

    const payload = {
        supplierId: Number(formData.supplierId),
        addressType: formData.addressType.trim(),
        addressLine1: formData.addressLine1.trim(),
        addressLine2: formData.addressLine2.trim() || null,
        countryCode: formData.countryCode.trim(),
        stateCode: formData.stateCode.trim(),
        city: formData.city.trim(),
        pincode: formData.pincode.trim(),
        phone: formData.phone.trim(),

        // Send decimal numbers, not strings.
        latitude:
            formData.latitude === "" || formData.latitude == null
                ? null
                : Number(formData.latitude),

        longitude:
            formData.longitude === "" || formData.longitude == null
                ? null
                : Number(formData.longitude),

        sellerId:
            formData.sellerId === ""
                ? null
                : Number(formData.sellerId),

        customerId:
            formData.customerId === ""
                ? null
                : Number(formData.customerId)
    };

    try {
        if (isEdit) {
            await axios.put(
                `${API_BASE_URL}/SupplierAddress/${id}`,
                {
                    ...payload,
                    supplierAddressId: Number(id)
                }
            );
        } else {
            await axios.post(
                `${API_BASE_URL}/SupplierAddress`,
                payload
            );
        }

        navigate("/supplier-addresses");
    } catch (error) {
        console.error("Failed to save supplier address:", error);

        const responseData = error.response?.data;

        setSubmitError(
            responseData?.message ||
            responseData?.title ||
            (typeof responseData === "string" ? responseData : null) ||
            error.message ||
            "Failed to save supplier address."
        );
    } finally {
        setSaving(false);
    }
};

if (loading) {
    return (
        <Box display="flex" justifyContent="center" mt={10}>
            <CircularProgress />
        </Box>
    );
}

return (
    <Container maxWidth="md" sx={{ py: 4 }}>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
            <IconButton onClick={() => navigate(-1)}>
                <ArrowBack />
            </IconButton>

            <Typography variant="h5" fontWeight={700}>
                {isEdit ? "Edit Supplier Address" : "Add Supplier Address"}
            </Typography>
        </Box>

        <Card>
            <CardContent>
                {submitError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {submitError}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={2.5}>
                        <Grid xs={12} md={6}>
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
                            >
                                <MenuItem value="">Select Supplier</MenuItem>

                                {suppliers.map((s, i) => {
                                    const sid = getFieldValue(
                                        s, "supplierId", "SupplierId", "id"
                                    );
                                    const name = getFieldValue(
                                        s, "supplierName", "SupplierName", "name"
                                    );

                                    return (
                                        <MenuItem
                                            key={sid || i}
                                            value={String(sid)}
                                        >
                                            {name || `Supplier ${sid}`}
                                        </MenuItem>
                                    );
                                })}
                            </TextField>
                        </Grid>

                        <Grid xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                required
                                label="Address Type"
                                name="addressType"
                                value={formData.addressType}
                                onChange={handleChange}
                            >
                                <MenuItem value="Billing">Billing</MenuItem>
                                <MenuItem value="Shipping">Shipping</MenuItem>
                                <MenuItem value="Office">Office</MenuItem>
                                <MenuItem value="Warehouse">Warehouse</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Address Line 1"
                                name="addressLine1"
                                value={formData.addressLine1}
                                onChange={handleChange}
                                error={Boolean(errors.addressLine1)}
                                helperText={errors.addressLine1}
                            />
                        </Grid>

                        <Grid xs={12}>
                            <TextField
                                fullWidth
                                label="Address Line 2"
                                name="addressLine2"
                                value={formData.addressLine2}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid xs={12} sm={4}>
                            <TextField
                                fullWidth
                                required
                                label="Country Code"
                                name="countryCode"
                                value={formData.countryCode}
                                onChange={handleChange}
                                error={Boolean(errors.countryCode)}
                                helperText={errors.countryCode}
                            />
                        </Grid>

                        <Grid xs={12} sm={4}>
                            <TextField
                                fullWidth
                                required
                                label="State Code"
                                name="stateCode"
                                value={formData.stateCode}
                                onChange={handleChange}
                                error={Boolean(errors.stateCode)}
                                helperText={errors.stateCode}
                            />
                        </Grid>

                        <Grid xs={12} sm={4}>
                            <TextField
                                fullWidth
                                required
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                error={Boolean(errors.city)}
                                helperText={errors.city}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Pincode"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                error={Boolean(errors.pincode)}
                                helperText={errors.pincode}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                error={Boolean(errors.phone)}
                                helperText={errors.phone}
                            />
                        </Grid>

                        <Grid xs={12}>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="subtitle1" fontWeight={600}>
                                Location & Mapping
                            </Typography>
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Latitude"
                                name="latitude"
                                placeholder="17.4485"
                                value={formData.latitude ?? ""}
                                onChange={handleChange}
                                error={Boolean(errors.latitude)}
                                helperText={errors.latitude || "Range: -90 to 90"}
                                inputProps={{ step: "any", min: -90, max: 90 }}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Longitude"
                                name="longitude"
                                placeholder="78.3908"
                                value={formData.longitude ?? ""}
                                onChange={handleChange}
                                error={Boolean(errors.longitude)}
                                helperText={errors.longitude || "Range: -180 to 180"}
                                inputProps={{ step: "any", min: -180, max: 180 }}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Seller ID"
                                name="sellerId"
                                value={formData.sellerId}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid xs={12} sm={6}>
                            <TextField
                                fullWidth
                                type="number"
                                label="Customer ID"
                                name="customerId"
                                value={formData.customerId}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    <Box mt={3} display="flex" gap={2}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            onClick={() => navigate(-1)}
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
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : isEdit
                                    ? "Update Address"
                                    : "Create Address"}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    </Container>
);


};

export default SupplierAddressEdit;
