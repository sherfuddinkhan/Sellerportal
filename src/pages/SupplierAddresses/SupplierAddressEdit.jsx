import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Button, Grid, TextField, MenuItem, CircularProgress, Alert, Box,
    Typography, Divider, Card, CardContent, Container, IconButton
} from "@mui/material";
import { ArrowBack, Save } from "@mui/icons-material";

const API_BASE_URL = "http://localhost:5000/api";

const getFieldValue = (data,...fields) => {
    for (const field of fields) {
        if (data?.[field]!== undefined && data?.[field]!== null && String(data?.[field]).trim()!== "") return data[field];
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
                    isEdit? axios.get(`${API_BASE_URL}/SupplierAddress/${id}`) : Promise.resolve(null)
                ]);
                const supList = supRes.data?.data || supRes.data || [];
                setSuppliers(Array.isArray(supList)? supList : []);

                if (isEdit && addrRes) {
                    const data = addrRes.data?.data || addrRes.data;
                    setFormData({
                        supplierId: String(getFieldValue(data, "supplierId", "SupplierId") || ""),
                        addressType: getFieldValue(data, "addressType", "AddressType") || "Billing",
                        addressLine1: getFieldValue(data, "addressLine1", "AddressLine1"),
                        addressLine2: getFieldValue(data, "addressLine2", "AddressLine2"),
                        countryCode: getFieldValue(data, "countryCode", "CountryCode") || "IN",
                        stateCode: getFieldValue(data, "stateCode", "StateCode", "state", "State"),
                        city: getFieldValue(data, "city", "City"),
                        pincode: getFieldValue(data, "pincode", "Pincode", "postalCode", "PostalCode"),
                        phone: getFieldValue(data, "phone", "Phone", "phoneNumber", "PhoneNumber"),
                        latitude: getFieldValue(data, "latitude", "Latitude"),
                        longitude: getFieldValue(data, "longitude", "Longitude"),
                        sellerId: String(getFieldValue(data, "sellerId", "SellerId") || ""),
                        customerId: String(getFieldValue(data, "customerId", "CustomerId") || ""),
                    });
                }
            } catch (err) {
                console.error(err);
                setSubmitError("Failed to load data");
            } finally { setLoading(false); }
        };
        load();
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value }));
        setErrors(prev => ({...prev, [name]: "" }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.supplierId) newErrors.supplierId = "Supplier required";
        if (!formData.addressLine1.trim()) newErrors.addressLine1 = "Required";
        if (!formData.city.trim()) newErrors.city = "Required";
        if (!formData.stateCode.trim()) newErrors.stateCode = "State code required";
        if (!formData.countryCode.trim()) newErrors.countryCode = "Country code required";
        if (!formData.pincode.trim()) newErrors.pincode = "Pincode required";
        if (!formData.phone.trim()) newErrors.phone = "Phone required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setSaving(true);
        setSubmitError("");

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
            latitude: formData.latitude.trim() || "17.4485",
            longitude: formData.longitude.trim() || "78.3908",
            sellerId: Number(formData.sellerId) || 0,
            customerId: Number(formData.customerId) || 0,
        };

        try {
            if (isEdit) {
                await axios.put(`${API_BASE_URL}/SupplierAddress/${id}`, {...payload, supplierAddressId: Number(id) });
            } else {
                await axios.post(`${API_BASE_URL}/SupplierAddress`, payload);
            }
            navigate("/supplier-addresses");
        } catch (error) {
            setSubmitError(error?.response?.data?.message || error?.message || "Failed to save");
        } finally { setSaving(false); }
    };

    if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box display="flex" alignItems="center" gap={1} mb={3}>
                <IconButton onClick={() => navigate(-1)}><ArrowBack /></IconButton>
                <Typography variant="h5" fontWeight={700}>{isEdit? "Edit Supplier Address" : "Add Supplier Address"}</Typography>
            </Box>
            <Card>
                <CardContent>
                    {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Grid container spacing={2.5}>
                            <Grid item xs={12} md={6}>
                                <TextField select fullWidth required label="Supplier" name="supplierId" value={formData.supplierId} onChange={handleChange} error={Boolean(errors.supplierId)} helperText={errors.supplierId}>
                                    <MenuItem value="">Select Supplier</MenuItem>
                                    {suppliers.map((s, i) => {
                                        const sid = getFieldValue(s, "supplierId", "SupplierId", "id");
                                        const name = getFieldValue(s, "supplierName", "SupplierName", "name");
                                        return <MenuItem key={sid || i} value={String(sid)}>{name || `Supplier ${sid}`}</MenuItem>;
                                    })}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField select fullWidth required label="Address Type" name="addressType" value={formData.addressType} onChange={handleChange}>
                                    <MenuItem value="Billing">Billing</MenuItem>
                                    <MenuItem value="Shipping">Shipping</MenuItem>
                                    <MenuItem value="Office">Office</MenuItem>
                                    <MenuItem value="Warehouse">Warehouse</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid item xs={12}><TextField fullWidth required label="Address Line 1" name="addressLine1" value={formData.addressLine1} onChange={handleChange} error={Boolean(errors.addressLine1)} helperText={errors.addressLine1} /></Grid>
                            <Grid item xs={12}><TextField fullWidth label="Address Line 2" name="addressLine2" value={formData.addressLine2} onChange={handleChange} /></Grid>

                            <Grid item xs={12} sm={4}><TextField fullWidth required label="Country Code" name="countryCode" placeholder="IN" value={formData.countryCode} onChange={handleChange} error={Boolean(errors.countryCode)} helperText={errors.countryCode} /></Grid>
                            <Grid item xs={12} sm={4}><TextField fullWidth required label="State Code" name="stateCode" placeholder="TG" value={formData.stateCode} onChange={handleChange} error={Boolean(errors.stateCode)} helperText={errors.stateCode} /></Grid>
                            <Grid item xs={12} sm={4}><TextField fullWidth required label="City" name="city" value={formData.city} onChange={handleChange} error={Boolean(errors.city)} helperText={errors.city} /></Grid>

                            <Grid item xs={12} sm={6}><TextField fullWidth required label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} error={Boolean(errors.pincode)} helperText={errors.pincode} /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth required label="Phone" name="phone" value={formData.phone} onChange={handleChange} error={Boolean(errors.phone)} helperText={errors.phone} /></Grid>

                            <Grid item xs={12}><Divider sx={{ my: 1 }} /><Typography variant="subtitle1" fontWeight={600}>Location & Mapping</Typography></Grid>

                            <Grid item xs={12} sm={6}><TextField fullWidth label="Latitude" name="latitude" placeholder="17.4485" value={formData.latitude} onChange={handleChange} /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Longitude" name="longitude" placeholder="78.3908" value={formData.longitude} onChange={handleChange} /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Seller ID" type="number" name="sellerId" value={formData.sellerId} onChange={handleChange} /></Grid>
                            <Grid item xs={12} sm={6}><TextField fullWidth label="Customer ID" type="number" name="customerId" value={formData.customerId} onChange={handleChange} /></Grid>
                        </Grid>

                        <Box mt={3} display="flex" gap={2}>
                            <Button variant="outlined" color="inherit" onClick={() => navigate(-1)} disabled={saving}>Cancel</Button>
                            <Button type="submit" variant="contained" startIcon={saving? <CircularProgress size={18} color="inherit" /> : <Save />} disabled={saving}>
                                {saving? "Saving..." : isEdit? "Update Address" : "Create Address"}
                            </Button>
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    );
};

export default SupplierAddressEdit;